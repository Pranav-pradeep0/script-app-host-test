import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useLocation } from 'react-router-dom';

import './loader.css';

const PreLoader = () => {
  const { pathname } = useLocation();
  const loaderRef = useRef(null);
  const loaderWrapRef = useRef(null);

  useEffect(() => {
    const main = document.querySelector('#main');
    const loader = loaderRef.current;
    const loaderWrap = loaderWrapRef.current;

    const tl = gsap.timeline();

    tl.to(loader, {
      duration: 1.5,
      scale: 0,
      ease: 'expo.inOut',
      onComplete: () => {
        const cdLoaderLayer = document.querySelector(
          pathname === '/login' || pathname === '/signup'
            ? 'cd-loader-layer'
            : 'cd-loader-layer-light',
        );
        cdLoaderLayer.classList.add('closing');
        main.style.opacity = 1;
        setTimeout(() => {
          loaderWrap.style.display = 'none';
        }, 1300);
      },
    });
  }, []);

  // setting className based on pathname
  const loaderLayerClass =
    pathname === '/login' || pathname === '/signup'
      ? 'cd-loader-layer'
      : 'cd-loader-layer-light';

  const loaderLayer =
    pathname === '/login' || pathname === '/signup'
      ? 'loader-layer'
      : 'loader-layer-light';

  return (
    <div className="loader-wrap" ref={loaderWrapRef}>
      <div className="loader-item">
        <div className={loaderLayerClass} data-frame="25">
          <div className={loaderLayer}></div>
        </div>
        <span className="loader" ref={loaderRef}></span>
      </div>
    </div>
  );
};

export default PreLoader;
