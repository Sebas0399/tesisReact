import { Key, useState, useEffect, useRef } from "react";
import { FileUpload } from "primereact/fileupload";
import { Image } from "primereact/image";
import { ProgressSpinner } from "primereact/progressspinner";
import { Card } from "primereact/card";
import NavBar from "./components/navbar";
import "./App.css"; // Importa tus estilos personalizados

function App() {
  const fileUploadRef = useRef<any>(null);

  const [selectedImage, setSelectedImage] = useState("");
  const [result, setResult] = useState(null);
  const [tiempo, setTiempo] = useState(null);
  const [resultPorcentaje, setResultPorcentaje] = useState({});
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<string[]>([]);

  useEffect(() => {
    // Lista de imágenes manualmente
    const imageList = [
      "ind1.jpg",
      "ind2.jpg",
      "golp1.jpg",
      "golp2.jpg",
      "part1.jpg",
      "part2.jpg",
    ];
    setImages(imageList.map((image) => `/images/${image}`));
  }, []);

  const invoiceUploadHandler = async ({ files }: { files: File[] }) => {
    const [file] = files;
    setLoading(true);
    await uploadInvoice(file); // Enviar el archivo directamente
    setLoading(false);
  };

  const uploadInvoice = async (invoiceFile: any) => {
    fileUploadRef.current.uploading = true;

    let formData = new FormData();
    formData.append("file", invoiceFile);
    console.log(formData);
    const response = await fetch(
      `https://antonyuwu-tesisapi.hf.space/analyze`,
      {
        method: "POST",
        body: formData,
      }
    );
    const jsonResponse = await response.json();
    setResult(jsonResponse.clase_predicha);
    setResultPorcentaje(jsonResponse.porcentajes_de_precisión);
    setTiempo(parseFloat(jsonResponse.time).toFixed(3)); // Formatear tiempo a 3 decimales
    fileUploadRef.current.clear(); // Limpiar el input de archivo
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

  const handleSampleImageClick = async (image: string) => {
    setSelectedImage(image);
    setResult(null);
    setResultPorcentaje({});
    setLoading(true);

    // Convertir la URL de la imagen a un Blob
    const response = await fetch(image);
    const blob = await response.blob();
    const file = new File([blob], "sample.jpg", { type: blob.type });

    await uploadInvoice(file);
    setLoading(false);
  };

  return (
    <>
      {" "}
      <NavBar />
      <div className="min-h-screen flex flex-col items-center bg-gray-100">
        <div className="container mx-auto p-4">
          {/* Título principal */}
          <h1 className="main-title text-4xl font-bold text-center mb-8">
            Tesis Uvillas
          </h1>

          {/* Contenedor principal centrado */}
          <div className="flex justify-center">
            <Card className="w-full md:w-1/2 p-4 centered-container">
              <h2 className="text-2xl font-semibold mb-4 text-center">
                Clasificador de Imágenes
              </h2>
              <div className="flex flex-col items-center image-upload-container">
                {selectedImage ? (
                  <Image
                    src={selectedImage}
                    width="300"
                    className="mb-4 uploaded-image"
                  />
                ) : (
                  <p className="mb-4">Selecciona una imagen para analizar</p>
                )}
                <FileUpload
                  ref={fileUploadRef}
                  mode="basic"
                  name="file"
                  customUpload
                  uploadHandler={invoiceUploadHandler}
                  accept="image/*"
                  onSelect={onSelect}
                  auto
                  chooseLabel="Seleccionar Imagen"
                  className="mb-4 file-upload-button"
                />
              </div>

              {/* Indicador de carga */}
              {loading && (
                <div className="flex flex-col items-center mb-4 loading-container">
                  <ProgressSpinner />
                  <p>Analizando imagen...</p>
                </div>
              )}

              {/* Resultados */}
              {result && (
                <div className="mt-4 text-center results-container">
                  <h2 className="text-xl font-semibold">Resultado:</h2>
                  <p>{result}</p>
                  <h3 className="text-lg font-semibold mt-2">
                    Porcentajes de Precisión:
                  </h3>
                  <ul className="list-disc list-inside centered-list">
                    <li>
                      Industria:{" "}
                      {parseFloat(resultPorcentaje.Industria || 0).toFixed(3)} %
                    </li>
                    <li>
                      Golpeada:{" "}
                      {parseFloat(resultPorcentaje.Golpeada || 0).toFixed(3)} %
                    </li>
                    <li>
                      Partida:{" "}
                      {parseFloat(resultPorcentaje.Partida || 0).toFixed(3)} %
                    </li>
                  </ul>
                  <h3 className="text-lg font-semibold mt-2">
                    Tiempo de Predicción:
                  </h3>
                  <p>{tiempo} segundos.</p>
                </div>
              )}
            </Card>
          </div>
        </div>
        <div className="container mx-auto p-4 muestra">
          <h2 className="text-2xl font-semibold text-center mb-4">
            Pruebe con imágenes de muestra
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {images.map(
              (image: string | undefined, index: Key | null | undefined) => (
                <div key={index} className="overflow-hidden rounded-lg">
                  <Image
                    src={image}
                    alt={`Image ${index}`}
                    width="250"
                    height="250"
                    loading="eager"
                    onClick={() => handleSampleImageClick(image)}
                    className="cursor-pointer transform transition-transform duration-300 hover:scale-105"
                  />
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
