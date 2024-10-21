import { useState } from "react";
import "./App.css";
import { FileUpload } from "primereact/fileupload";
import { Image } from "primereact/image";
import { ProgressSpinner } from "primereact/progressspinner";
import { Dropdown } from "primereact/dropdown";

function App() {
  const [selectedImage, setSelectedImage] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState<{
    name: string;
    code: number;
  } | null>(null);
  const modelos = [
    { name: "Darknet", code: 1 },
    { name: "MobileNet", code: 2 },
    { name: "Resnet", code: 3 },
  ];
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
      <h1>{selectedModel ? selectedModel.code : "No model selected"}</h1>
      <div className="card flex justify-content-center">
        <Dropdown
          value={selectedModel}
          onChange={(e) => setSelectedModel(e.value)}
          options={modelos}
          optionLabel="name"
          placeholder="Select a City"
          className="w-full md:w-14rem"
        />
      </div>
      <Image src={selectedImage} width="300"></Image>
      <FileUpload
        mode="basic"
        name="file"
        url={`https://tesisapi-h38w.onrender.com/analyze/${selectedModel?.code}`}
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
