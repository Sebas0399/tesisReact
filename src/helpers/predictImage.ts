import axios from 'axios'
//consumir api
const url = 'https://tesisapi-h38w.onrender.com/'
async function predict(image: File) {
    const formData = new FormData();
    formData.append('image', image);
    try {
        const { response } = await axios.post(
            url,
           formData,
    }
}