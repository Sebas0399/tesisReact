import { useState, useRef } from "react";
import "./App.css";
import { FileUpload } from "primereact/fileupload";
import { Image } from "primereact/image";
import { ProgressSpinner } from "primereact/progressspinner";
import { Button } from "primereact/button";
import axios from "axios";
function App() {
  const [selectedImage, setSelectedImage] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isCameraOpen, setIsCameraOpen] = useState(false); // Estado para controlar la cámara
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const onUpload = (e: any) => {
    const response = e.xhr.response;
    try {
      const jsonResponse = JSON.parse(response);
      setResult(jsonResponse);
    } catch (error) {
      console.error("Error al parsear la respuesta del servidor:", error);
    } finally {
      console.log(response);
    }
    setLoading(false);
  };

  const onSelect = (e: any) => {
    const file = e.files[0];
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target && typeof event.target.result === "string") {
        setSelectedImage(event.target.result); // Convertir el archivo a una URL temporal
      }
    };
    setResult(null);
    reader.readAsDataURL(file); // Convertir el archivo a base64 para mostrarlo
  };

  const openCamera = async () => {
    setIsCameraOpen(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (error) {
      console.error("No se pudo acceder a la cámara:", error);
      setIsCameraOpen(false);
    }
  };

  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext("2d");
      if (context) {
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;
        context.drawImage(videoRef.current, 0, 0);
        const imageData = canvasRef.current.toDataURL("image/png");
        setSelectedImage(imageData); // Asigna la imagen capturada
        closeCamera();
      }
    }
  };

  const closeCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      const tracks = stream.getTracks();
      tracks.forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsCameraOpen(false);
  };

  const postImage= async () => {
    await axios.post(
      'https://antonyuwu-tesisapi.hf.space/analyze/2',
      selectedImage,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
  }

  return (
    <>
      <Image src={selectedImage} width="300" alt="Imagen seleccionada o capturada" />
      <FileUpload
        mode="basic"
        name="file"
        url={`https://antonyuwu-tesisapi.hf.space/analyze/2`}
        accept="image/*"
        onUpload={onUpload}
        onProgress={() => setLoading(true)}
        onSelect={onSelect}
      />
      <Button onClick={postImage}></Button>
      <button onClick={openCamera}>Abrir Cámara</button>
      {isCameraOpen && (
        <div>
          <video ref={videoRef} style={{ width: "300px" }}></video>
          <button onClick={captureImage}>Capturar Imagen</button>
          <button onClick={closeCamera}>Cerrar Cámara</button>
        </div>
      )}
      <canvas ref={canvasRef} style={{ display: "none" }}></canvas>
      <h1>{result}</h1>

      {loading ? <ProgressSpinner /> : null}
    </>
  );
}

export default App;
