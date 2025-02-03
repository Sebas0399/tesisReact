import { useState } from "react";
import "./App.css";
import { FileUpload } from "primereact/fileupload";
import { Image } from "primereact/image";
import { ProgressSpinner } from "primereact/progressspinner";
import { Card } from "primereact/card";

function App() {
  const [selectedImage, setSelectedImage] = useState("");
  const [result, setResult] = useState(null);
  const [tiempo, setTiempo] = useState(null);
  const [resultPorcentaje, setResultPorcentaje] = useState({});
  const [loading, setLoading] = useState(false);

  const onUpload = (e: any) => {
    const response = e.xhr.response;
    try {
      const jsonResponse = JSON.parse(response);
      setResult(jsonResponse.clase_predicha);
      setResultPorcentaje(jsonResponse.porcentajes_de_precisión);
      setTiempo(parseFloat(jsonResponse.time).toFixed(3)); // Formatear tiempo a 3 decimales
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
    setResultPorcentaje({});
    reader.readAsDataURL(file); // Convertir el archivo a base64 para mostrarlo
  };

  return (
    <div className="app-container">
      {/* Título principal */}
      <h1 className="main-title">Tesis Uvillas</h1>

      {/* Contenedor principal centrado */}
      <div className="centered-container">
        <Card title="Clasificador de Imágenes" className="card-container">
          <div className="image-upload-container">
            {selectedImage ? (
              <Image src={selectedImage} width="300" className="uploaded-image" />
            ) : (
              <p>Selecciona una imagen para analizar</p>
            )}
            <FileUpload
              mode="basic"
              name="file"
              url="https://antonyuwu-tesisapi.hf.space/analyze"
              accept="image/*"
              onUpload={onUpload}
              onProgress={() => setLoading(true)}
              onSelect={onSelect}
              chooseLabel="Seleccionar Imagen"
              className="file-upload-button"
            />
          </div>

          {/* Indicador de carga */}
          {loading && (
            <div className="loading-container">
              <ProgressSpinner />
              <p>Analizando imagen...</p>
            </div>
          )}

          {/* Resultados */}
          {result && (
            <div className="results-container">
              <h2>Resultado:</h2>
              <p>{result}</p>
              <h3>Porcentajes de Precisión:</h3>
              <ul>
                <li>
                  Industria:{" "}
                  // @ts-ignore
                  {parseFloat(resultPorcentaje.Industria || 0).toFixed(3)} %
                </li>
                <li>
                  Golpeada:{" "}
                  // @ts-ignore
                  {parseFloat(resultPorcentaje.Golpeada || 0).toFixed(3)} %
                </li>
                <li>
                  Partida:{" "}
                  // @ts-ignore
                  {parseFloat(resultPorcentaje.Partida || 0).toFixed(3)} %
                </li>
              </ul>
              <h3>Tiempo de Predicción:</h3>
              <p>{tiempo} segundos.</p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}

export default App;