import http from './http-common-servicecall'

class ServiceCall{
    
    submitFile(formData){
        // const formData = new FormData();
        // console.log(files[0])
        // formData.append("file", files[0]);
        // formData.append("filename", files[0].name);
        console.log("here")
        return http.post("/submitFile", formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
        })
    }

    addBrandGuideline(files){
        const formData = new FormData();
        console.log(files[0])
        formData.append("file", files[0]);
        formData.append("filename", files[0].name);
        return http.post("/addBrandGuideline", formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
        })
    }

    returnFile(){
        return http.get("/returnFile", {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
        })
    }

    getCSVFileData(csv_file_path){
        const formData = new FormData();
        console.log(csv_file_path.value)
        formData.append("csv_file_path",csv_file_path.value);
        return http.post("/getCSVFileData", formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
    }

    triggerDTale(csv_file_path){
        const formData = new FormData();
        console.log(csv_file_path)
        formData.append("csv_file_path",csv_file_path.value);
        return http.post("/dtale", formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
    }
}

export default new ServiceCall();