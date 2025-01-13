import { useState } from "react";
import "./App.css";
import { FileUpload } from "primereact/fileupload";
import { Image } from "primereact/image";
import { ProgressSpinner } from "primereact/progressspinner";

function App() {
  const [selectedImage, setSelectedImage] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

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

  return (
    <>      
      <Image src={selectedImage} width="300"></Image>
      <FileUpload
        mode="basic"
        name="file"
        url={`https://antonyuwu-tesisapi.hf.space/analyze/2}`}
        accept="image/*"
        onUpload={onUpload}
        onProgress={() => setLoading(true)}
        onSelect={onSelect} // Cuando seleccionas un archivo
      />
      <h1>{result}</h1>
      {loading ? <ProgressSpinner /> : null}
    </>
  );
}

export default App;
