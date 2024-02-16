/* eslint-disable react/prop-types */
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import {
  LexicalTypeaheadMenuPlugin,
  MenuOption,
} from '@lexical/react/LexicalTypeaheadMenuPlugin';
import { useCallback, useLayoutEffect, useMemo, useState } from 'react';
import * as ReactDOM from 'react-dom';
import { $createTextNode, $getSelection } from 'lexical';
import { useDebounce, useTransliteration } from '@hooks';
import { useSelector } from 'react-redux';

import { $isSluglineNode } from '@/nodes/SluglineNode';
import { $isSceneNode } from '@/nodes/SceneNode';
import { $isParentheticalNode } from '@/nodes/ParentheticalNode';

// Length of the input string sent to transliterate.
const INPUT_LENGTH = 50;

// Regex to match string that includes forward slash (/)
const fwSlashRegex = new RegExp(/^[a-zA-Z]+(\/[a-zA-Z]+)*\/?$/);

// regex to check if the user is typing only letters
const lettersTriggerRegex = new RegExp(`^[a-zA-Z]{1,${INPUT_LENGTH}}$`);

// At most, 5 suggestions are shown in the popup.
const TRANSLATE_SUGGESTION_LIST_LENGTH_LIMIT = 5;

// Suggestions list for Slugline Component.
const SLUGLINE_SUGGESTIONS = [
  'Day/Int',
  'Day/Ext',
  'Day/Int/Ext',
  'Night/Int',
  'Night/Ext',
  'Night/Int/Ext',
  'Day/Night/Int/Ext',
];

// Suggestion list for Scene Component.
const SCENE_SUGGESTIONS = ['FlashCut/ഫ്ലാഷ്ക്കട് : ', 'Scene/സീൻ : '];

// NODE TYPES ENUM
const NODE_TYPES = {
  DEFAULT: 0,
  SLUGLINE: 1,
  SUBHEADER: 2,
  DIALOGUE: 3,
  PARENTHETICAL: 4,
  DIALOGUE_CONTAINER: 5,
  ACTION: 6,
  SCENE: 7,
};
Object.freeze(NODE_TYPES);

// TODO - refactor this temporary code
/**
 * checks and returns the result of type ahead trigger
 * for slugline.
 *
 * @param {String} text
 * @returns {Object}
 */
function matchInputInSlugline(text) {
  const filtered = SLUGLINE_SUGGESTIONS.filter((value) => text === value);
  const match = fwSlashRegex.exec(text);
  if (match !== null && filtered.length === 0) {
    return {
      matchingString: match[0],
      replaceableString: match[0],
      leadOffset: match.index,
    };
  }
  return null;
}
/**
 * checks and returns the result of type-ahead trigger
 * for Scene
 * @param {String} text
 * @returns {Object}
 */
function matchInputInScene(text) {
  const fwSlashRegex = new RegExp(/^[a-zA-Z]+(\/[a-zA-Z]+)*\/?$/);
  const filtered = SCENE_SUGGESTIONS.filter((value) => text === value);
  const match = fwSlashRegex.exec(text);
  if (match !== null && filtered.length === 0) {
    return {
      matchingString: match[0],
      replaceableString: match[0],
      leadOffset: match.index,
    };
  }
  return null;
}

/**
 * get the last word with only
 * letters and returns results for trigger fn.
 * @param {string} text
 * @returns {Object}
 */
function matchCommonText(text) {
  const word = getLastWordWithOnlyLetters(text);
  let match = null;
  if (word) match = lettersTriggerRegex.exec(word);
  if (match !== null) {
    return {
      matchingString: match[0],
      replaceableString: match[0],
      leadOffset: match.index,
    };
  }
  return null;
}

/**
 * returns the last word with only letters
 *
 * @param {String} input
 * @returns {String}
 */
function getLastWordWithOnlyLetters(input) {
  // Use a regular expression to find the last word with only letters
  const matches = input.match(/[a-zA-Z]+(?=\s|$)/g);
  // Check if there are any matches
  if (matches && matches.length > 0) {
    // Return the last match
    if (/[^a-zA-Z]$/.test(input)) return null;
    return matches.pop();
  } else {
    // No match found, return null
    return null;
  }
}

/**
 * searches in slug line suggestion list
 * for matching results
 *
 * @param {String} input
 * @returns {Array}
 */
function searchSluglineSuggestion(input) {
  return SLUGLINE_SUGGESTIONS.filter((value) => {
    return value.toLowerCase().includes(input.toLowerCase());
  });
}
/**
 * searches in scene suggestion list
 * for matching results
 *
 * @param {String} input
 * @returns {Array}
 */
function searchSceneSuggestion(input) {
  return SCENE_SUGGESTIONS.filter((value) => {
    return value.toLowerCase().includes(input.toLowerCase());
  });
}

/**
 * returns a list of suggestions depending on nodeType.
 * Normal text and suggestions for SlugLine nodes are implemented
 *
 * @param {String} inputString
 * @param {Number} nodeType
 * @returns {Array}
 */
function useSuggestionGenService(inputString, nodeType) {
  const [results, setResults] = useState([]);
  const transliterate = useTransliteration();
  const { characters } = useSelector((state) => state.scripts);

  // debounce callback
  const debounceCb = (string) => {
    transliterate(string).then((result) => {
      setResults(Array.isArray(result) ? result : []);
    });
  };
  const transliterateDebounced = useDebounce(debounceCb, 50);

  //TODO - refactor this code
  const searchCharacter = (inputString) => {
    let filtered = characters.filter((value) => value.includes(inputString));
    if (filtered.length > 0) return setResults(filtered);

    transliterate(inputString).then((res) => {
      filtered = characters.filter((value) => value.includes(res[0]));
      setResults(filtered);
    });
  };

  useLayoutEffect(() => {
    if (inputString == null || inputString.length > INPUT_LENGTH) {
      setResults([]);
      return;
    }

    switch (nodeType) {
      case NODE_TYPES.SLUGLINE:
        setResults(searchSluglineSuggestion(inputString));
        break;
      case NODE_TYPES.SCENE:
        setResults(searchSceneSuggestion(inputString));
        break;
      case NODE_TYPES.PARENTHETICAL:
        searchCharacter(inputString);
        break;
      default:
        transliterateDebounced(inputString);
    }
  }, [inputString]);

  return results;
}

class WordSuggestionAhead extends MenuOption {
  word;

  constructor(word) {
    super(word);
    this.word = word;
  }
}

function WordSuggestionAheadMenuItem({
  index,
  isSelected,
  onClick,
  onMouseEnter,
  option,
}) {
  let className = 'item';
  if (isSelected) {
    className += ' selected';
  }
  return (
    <li
      key={option.key}
      tabIndex={-1}
      className={className}
      ref={option.setRefElement}
      role="option"
      aria-selected={isSelected}
      id={'typeahead-item-' + index}
      onMouseEnter={onMouseEnter}
      onClick={onClick}
    >
      <span className="text">{option.word}</span>
    </li>
  );
}

export default function TextSuggestionPlugin() {
  const [editor] = useLexicalComposerContext();

  const [queryString, setQueryString] = useState(null);
  const [results, setResults] = useState([]);
  const [nodeType, setNodeType] = useState(NODE_TYPES.DEFAULT);
  const suggestions = useSuggestionGenService(queryString, nodeType);

  useLayoutEffect(() => {
    setResults(suggestions);
  }, [suggestions]);

  const options = useMemo(
    () => results.map((result) => new WordSuggestionAhead(result)),
    [results],
  );

  const onSelectOption = useCallback(
    (selectedOption, nodeToReplace, closeMenu) => {
      editor.update(() => {
        const textNode = $createTextNode(selectedOption.word);
        textNode.setFormat($getSelection().format);
        if (nodeToReplace) {
          nodeToReplace.replace(textNode);
        }
        textNode.select();
        closeMenu();
        setResults([]);
      });
    },
    [editor],
  );

  const triggerFn = useCallback(
    (text) => {
      let result = null;
      editor.getEditorState().read(() => {
        const anchorParent = $getSelection().anchor.getNode().getParent();
        if ($isSluglineNode(anchorParent)) {
          result = matchInputInSlugline(text);
          setNodeType(NODE_TYPES.SLUGLINE);
        } else if ($isSceneNode(anchorParent)) {
          result = matchInputInScene(text);
          setNodeType(NODE_TYPES.SCENE);
        } else if ($isParentheticalNode(anchorParent)) {
          result = matchCommonText(text);
          setNodeType(NODE_TYPES.PARENTHETICAL);
        } else {
          result = matchCommonText(text);
          setNodeType(NODE_TYPES.DEFAULT);
        }
      });
      return result;
    },
    [editor],
  );
  return (
    <LexicalTypeaheadMenuPlugin
      onQueryChange={setQueryString}
      onSelectOption={onSelectOption}
      triggerFn={triggerFn}
      options={options}
      anchorClassName="typeahead-anchor"
      menuRenderFn={(
        anchorElementRef,
        { selectedIndex, selectOptionAndCleanUp, setHighlightedIndex },
      ) => {
        return anchorElementRef.current && results.length
          ? ReactDOM.createPortal(
              <div className="typeahead-popover mentions-menu">
                <ul>
                  {options.map((option, i) => (
                    <WordSuggestionAheadMenuItem
                      index={i}
                      isSelected={selectedIndex === i}
                      onClick={() => {
                        setHighlightedIndex(i);
                        selectOptionAndCleanUp(option);
                      }}
                      onMouseEnter={() => {
                        setHighlightedIndex(i);
                      }}
                      key={option.key}
                      option={option}
                    />
                  ))}
                </ul>
              </div>,
              anchorElementRef.current,
            )
          : null;
      }}
    />
  );
}
