import React, { useState } from "react";
import axios from "axios";

function ImageUploader() {
  const [image, setImage] = useState(null);
  const [response, setResponse] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
    }
  };

  const processImage = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        const imgElement = new Image();
        imgElement.src = reader.result;

        imgElement.onload = () => {
          // Redimensionar la imagen a 224x224 píxeles (o cualquier tamaño esperado por el modelo)
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");
          const targetWidth = 224;
          const targetHeight = 224;

          // Redimensionar la imagen
          canvas.width = targetWidth;
          canvas.height = targetHeight;
          ctx.drawImage(imgElement, 0, 0, targetWidth, targetHeight);

          // Obtener los píxeles
          const imageData = ctx.getImageData(0, 0, targetWidth, targetHeight);
          const data = imageData.data;

          // Convertir los datos de la imagen a un array de números flotantes (normalización básica)
          const imageArray = [];
          for (let i = 0; i < data.length; i += 4) {
            imageArray.push([
              data[i] / 255.0, // R
              data[i + 1] / 255.0, // G
              data[i + 2] / 255.0, // B
            ]);
          }

          // Comprobamos el tamaño del array antes de enviarlo
          console.log("Tamaño del array procesado:", imageArray.length);

          resolve(imageArray); // Devuelves el array de píxeles
        };

        imgElement.onerror = reject;
      };

      reader.onerror = reject;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!image) {
      alert("Por favor, selecciona una imagen.");
      return;
    }

    try {
      const processedData = await processImage(image);

      console.log("Datos procesados:", processedData); // Verificamos los datos procesados

      const requestBody = {
        instances: [
          {
            inputs: processedData, // Enviar los datos de la imagen como tensor
          },
        ],
      };

      // Verificamos el tamaño del JSON antes de enviarlo
      console.log(
        "Tamaño de la solicitud JSON:",
        JSON.stringify(requestBody).length
      );

      const res = await axios.post(
        "http://localhost:8501/v1/models/mi_modelo:predict", // Dirección del servidor TensorFlow Serving
        requestBody,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      setResponse(res.data);
    } catch (error) {
      console.error("Error al procesar o subir la imagen:", error);
    }
  };

  return (
    <div>
      <h2>Subir Imagen para Predicción</h2>
      <form onSubmit={handleSubmit}>
        <input type="file" onChange={handleImageChange} />
        <button type="submit">Enviar Imagen</button>
      </form>

      {response && (
        <div>
          <h3>Resultado:</h3>
          <pre>{JSON.stringify(response, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

export default ImageUploader;
