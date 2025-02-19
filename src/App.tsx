import { Key, useState, useEffect, useRef } from "react";
import "./App.css";
import { FileUpload } from "primereact/fileupload";
import { Image } from "primereact/image";
import { ProgressSpinner } from "primereact/progressspinner";
import { Card } from "primereact/card";
import { Menubar } from "primereact/menubar";

function App() {
  const icon = <i className="pi pi-search"></i>;
  const fileUploadRef = useRef<any>(null);

  const items = [
    {
      label: "Home",
      icon: "pi pi-home",
    },
    {
      label: "Features",
      icon: "pi pi-star",
    },
    {
      label: "Projects",
      icon: "pi pi-search",
      items: [
        {
          label: "Components",
          icon: "pi pi-bolt",
        },
        {
          label: "Blocks",
          icon: "pi pi-server",
        },
        {
          label: "UI Kit",
          icon: "pi pi-pencil",
        },
        {
          label: "Templates",
          icon: "pi pi-palette",
          items: [
            {
              label: "Apollo",
              icon: "pi pi-palette",
            },
            {
              label: "Ultima",
              icon: "pi pi-palette",
            },
          ],
        },
      ],
    },
    {
      label: "Contact",
      icon: "pi pi-envelope",
    },
  ];
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
    console.log(response);
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
    <div>
      <div className="card">
        <Menubar model={items} />
      </div>

      <div className="app-container">
        {/* Título principal */}
        <h1 className="main-title">Tesis Uvillas</h1>

        {/* Contenedor principal centrado */}
        <div className="centered-container">
          <Card title="Clasificador de Imágenes" className="card-container">
            <div className="image-upload-container">
              {selectedImage ? (
                <Image
                  src={selectedImage}
                  width="300"
                  className="uploaded-image"
                />
              ) : (
                <p>Selecciona una imagen para analizar</p>
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
                <h3>Tiempo de Predicción:</h3>
                <p>{tiempo} segundos.</p>
              </div>
            )}
          </Card>
        </div>
      </div>
      <div className="muestra">
        <h2>Pruebe con imágenes de muestra</h2>
        <div className="card flex justify-content-center image-grid">
          {images.map(
            (image: string | undefined, index: Key | null | undefined) => (
              <Image
                key={index}
                src={image}
                alt={`Image ${index}`}
                width="250"
                height="250"
                loading="eager"
                onClick={() => handleSampleImageClick(image)}
                style={{ cursor: "pointer" }}
              />
            )
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
