import React, { useState } from "react";
import path from "path";
import { toast } from "react-toastify";
import { UploadIcon } from "./Icons";
import UploadVideoModal from "./UploadVideoModal";
import { upload } from "../utils";

const UploadVideo = () => {
  const [showModal, setShowModal] = useState(false);
  const [previewVideo, setPreviewVideo] = useState("");
  const closeModal = () => setShowModal(false);

  const [url, setUrl] = useState("");
  const [thumbnail, setThumbnail] = useState("");

  const handleVideoUpload = async (e) => {
    const file = e.target.files[0];

    if (file) {
      const size = file.size / 1000000;

      if (size > 300) {
        return toast.error("Извините, не умею грузить файлы больше 300MB");
      }

      const url = URL.createObjectURL(file);
      setPreviewVideo(url);
      setShowModal(true);

      const data = await upload("video", file);
      setUrl(data);

      const ext = path.extname(data);
      setThumbnail(data.replace(ext, ".jpg"));
      
    }
  };

  return (
    <div>
      <label htmlFor="video-upload">
        <UploadIcon />
      </label>
      <input
        style={{ display: "none" }}
        id="video-upload"
        type="file"
        accept="video/*"
        onChange={handleVideoUpload}
      />
      {showModal && (
        <UploadVideoModal
          closeModal={closeModal}
          previewVideo={previewVideo}
          thumbnail={thumbnail}
          url={url}
        />
      )}
    </div>
  );
};

export default UploadVideo;
