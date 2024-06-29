import React from 'react';
import Modal from 'react-modal';
import ClipLoader from 'react-spinners/ClipLoader';

interface MediaModalProps {
  isOpen: boolean;
  fileURL: string;
  fileType: string;
  onRequestClose: () => void;
  isLoading: boolean; // Receive the loading state
}

const MediaModal: React.FC<MediaModalProps> = ({ isOpen, fileURL, fileType, onRequestClose, isLoading }) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Media Preview"
      className="bg-black bg-opacity-75 flex justify-center items-center fixed inset-0"
      overlayClassName="bg-black bg-opacity-50 fixed inset-0"
    >
      <div className="bg-white p-4 rounded-lg shadow-lg">
        {isLoading ? (
          <div className="flex justify-center items-center">
            <ClipLoader color="green" loading={isLoading} size={50} />
          </div>
        ) : (
          <>
            {fileType.startsWith('image/') && (
              <img src={fileURL} alt="Full Preview" className="w-64 h-auto" />
            )}
            {fileType.startsWith('video/') && (
              <video controls className="w-80 h-auto">
                <source src={fileURL} type={fileType} />
                Your browser does not support the video tag.
              </video>
            )}
          </>
        )}
        <button
          onClick={onRequestClose}
          className="mt-4 bg-red-500 text-white rounded p-2 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
        >
          Close
        </button>
      </div>
    </Modal>
  );
};

export default MediaModal;
