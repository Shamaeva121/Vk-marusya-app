// components/TrailerModal/TrailerModal.tsx
import React from 'react';
import Modal from 'react-modal';
import ReactPlayer from 'react-player';
import './TrailerModal.scss';
import {TrailerModalProps } from '../../types/types'

const TrailerModal: React.FC<TrailerModalProps> = ({ isOpen, onRequestClose, trailerYoutubeId }) => {
  const playerProps = {
    src: trailerYoutubeId ? `https://www.youtube.com/watch?v=${trailerYoutubeId}`: undefined,
    className: 'react-player',
    width: '100%',
    height: '100%',
    controls: true,
    config: {
      youtube: {
        playerVars: {
          controls: 1,
          origin: window.location.origin,
        },
      },
    } as any,
    onError: (error: any) => {
      console.error("ReactPlayer Error:", error);
    },
    onEnded: onRequestClose,
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      className="trailer-modal"
      overlayClassName="trailer-modal-overlay"
      ariaHideApp={false}
    >
      {trailerYoutubeId ? (
        <>
          <div className="player-wrapper">
            <ReactPlayer {...playerProps} />
          </div>
          <button onClick={onRequestClose} className="trailer-modal-close-button">
            <img src="/icons/icon-back-modal.svg" alt="Закрыть" />
          </button>
        </>
      ) : (
        <p>Трейлер не найден.</p>
      )}
    </Modal>
  );
};

export default TrailerModal;