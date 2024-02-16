import React, { useEffect, useRef, useState } from 'react';
import styles from './autocompleteTextarea.module.css';
import { useTransliteration } from '@hooks';

const AutoCompleteTextArea = ({
  index,
  tableData,
  setTableData,
  name,
  selectedItemIndex,
  setSelectedItemIndex,
  handleSubmit
}) => {
  
  const [suggestions, setSuggestions] = useState([]);
  const textAreaRef = useRef(null);
  const transliterate = useTransliteration();
  const [ModalHeight, setModalHeight] = useState('50px');



  const [tableOpen, setTableOpen] = useState({
    scene: false,
    location: false,
    time: false,
    IntOrExt: false,
    Action: false,
    Character: false,
  });

  const handleAutocompleteChange = (value) => {
    fetchSearchOptions(value);
    const updatedTableData = [...tableData];
    updatedTableData[index][name] = value;
    setTableData(updatedTableData);
  };

  const fetchSearchOptions = async (value) => {
    const inputText = value;
    const delimiterRegex = /[,.?\[\](_)+\s]+/;
    const words = inputText.split(delimiterRegex);
    const lastWord = words.pop();
    const response = await transliterate(lastWord);
    setSuggestions(response);
  };

  const handleSpaceKey = (e) => {
    const inputValue = e.target.value;
    if (e.key === ' ' && inputValue.trim() !== '') {
      setSuggestions([]);
      setSelectedItemIndex(0);
    }
  };

  const handleItemAdd = (item, index, field) => {
    if (item && suggestions) {
      const values = [...tableData];
      const currentFieldValue = values[index][field];
      const delimiterRegex = /[,.?\[\](_)+\s]+/;
      const words = currentFieldValue.split(delimiterRegex);

      if (words.length > 0) {
        words[words.length - 1] = item;
        values[index][field] = words.join(' ') + ' ';
      }
      setTableData(values);
      setSuggestions([]);
      textAreaRef.current.focus();
      setSelectedItemIndex(0);
    } else {
      console.log('');
    }
  };

  const handleBlur = () => {
    setTimeout(() => {
      setTableOpen((prev) => ({ ...prev, [name]: false }));
      setSelectedItemIndex(0);
      setSuggestions([]);
    }, 300);
  };

  useEffect(() => {
    const { current: textarea } = textAreaRef;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
      setModalHeight(`${textarea.scrollHeight - 10}px`);
    }
  }, [tableData]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleItemAdd(suggestions[selectedItemIndex], index, name);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedItemIndex((prevIndex) =>
        prevIndex === 0 ? 4 : prevIndex - 1,
      );
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedItemIndex((prevIndex) =>
        prevIndex === 4 ? 0 : prevIndex + 1,
      );
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedItemIndex, suggestions]);

  const handleIntOrExtValue = (item) => {
    if (item) {
      const tableValue = [...tableData];
      tableValue[index][name] = item;
      setTableData(tableValue);
    }
  };

  return (
    <div className={styles.container}>
      <textarea
        ref={textAreaRef}
        id={`textarea-${index}`}
        className={styles.textarea}
        onChange={(e) => {
          handleAutocompleteChange(e.target.value);
        }}
        value={tableData[index][name]}
        rows={3}
        onFocus={() => {
          setTableOpen((prev) => ({ ...prev, [name]: true }));
        }}
        onBlur={() => {
          handleBlur()
          handleSubmit()
        }}
        onKeyUp={(e) => handleSpaceKey(e)}
      />
      {name === 'IntOrExt' ? (
        <div className={styles.suggetionContainer}>
          {tableOpen['IntOrExt'] &&
            tableData[index]['IntOrExt'].length === 0 &&
            intorextValues.map((item, index) => (
              <div
                key={item}
                className={`${styles.suggetionItem} ${
                  selectedItemIndex === index ? styles.selected : ''
                } `}
                onClick={() => handleIntOrExtValue(item, index, name)}
              >
                {item}
              </div>
            ))}
        </div>
      ) : (
        <div className={styles.suggetionContainer} style={{ top: ModalHeight }}>
          {suggestions &&
            suggestions.length > 1 &&
            tableOpen[name] &&
            suggestions.map((item, ind) => (
              <div
                className={`${styles.suggetionItem} ${
                  selectedItemIndex === ind ? styles.selected : ''
                }`}
                onClick={() => handleItemAdd(item, index, name)}
                key={ind}
              >
                {item}
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default AutoCompleteTextArea;