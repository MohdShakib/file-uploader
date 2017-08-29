(function(){
    "use strict";

    var config = {
        uploadUrl: '/upload',
        maxSize: '1000',  // size in kb
        allowedExtensions: ['image/png','image/jpg', 'image/jpeg', 'application/pdf']
    }

    var uploadBtn   = document.getElementsByClassName('upload-btn'),
    uploadInpt  = document.getElementById('upload-input'),
    progressBar = document.getElementsByClassName('progress-bar')[0],
    notificationEle = document.getElementById('notification-msg'),
    prevImgEle = document.getElementById('prev-image'),
    extnMsgEle = document.getElementsByClassName('extensions-msg')[0],
    setTimeoutVar;

    extnMsgEle.innerHTML = config.allowedExtensions.join(', ');

    uploadBtn[0].addEventListener('click', function(){
        uploadInpt.click();
        resetProgressBar();
    });

    uploadInpt.addEventListener('change', function(){
        var files = this.files;
        if(!files.length){
            resetProgressBar();
        }else if (files.length > 0){
            // create a FormData object which will be sent as the data payload in the
            var formData = new FormData();
            // loop through all the selected files
            for (var i = 0; i < files.length; i++) {
                var file = files[i];

                if(file.size > config.maxSize*1000){
                    alert('File Size Exceeded ! Please retry.');
                    showNotification(true, false, 'File Size Exceeded ! Please retry.');
                    return;
                }

                if(config.allowedExtensions.indexOf(file.type) >=0 ){
                    if(file.type.indexOf('image') != -1){
                        previewImage(file);
                    }
                    formData.append('uploads[]', file, file.name);
                }else {
                    alert('Please recheck file. Following extensions are supported : '+config.allowedExtensions.join(', '));
                    return;
                }
            }
            // ajax request to upload files
            ajaxFileUpload(formData);
        }

    });

    function resetProgressBar(){
        progressBar.innerHTML  = '0%';
        progressBar.style.width = '0%';
        prevImgEle.classList.add('hide');
        showNotification(false, true);
    }

    function showNotification(error, reset, message){
        if(setTimeoutVar){
            clearTimeout(setTimeoutVar);
        }
        let className = 'success';

        message = message || 'File uploaded successfully.';
        if(error){
            message     = message || 'Some error occured, Please check API !';
            className   = 'error';
        }else if(reset){
            message = className = '';
        }
        notificationEle.innerHTML = message;
        notificationEle.className = className;
        setTimeoutVar = setTimeout(function(){
            notificationEle.innerHTML = '';
            notificationEle.className = '';
        }, 10000);
    }

    function previewImage(file){
       var reader = new FileReader();
       reader.onload = function (e) {
           prevImgEle.src = e.target.result;
           prevImgEle.classList.remove('hide');
       }
       reader.readAsDataURL(file);
    }

    function ajaxFileUpload(formData){
        var xhr = new XMLHttpRequest();
        // listen to the 'progress' event
        xhr.upload.addEventListener('progress', function(evt) {
            if (evt.lengthComputable) {
                // calculate the percentage of upload completed
                var percentComplete = evt.loaded / evt.total;
                percentComplete = parseInt(percentComplete * 100);

                // update the Bootstrap progress bar with the new percentage
                progressBar.innerHTML    = percentComplete + '%';
                progressBar.style.width  = percentComplete + '%';

                // once the upload reaches 100%, set the progress bar text to done
                if (percentComplete === 100) {
                    progressBar.innerHTML = 'Done';
                }
            }
        }, false);

        xhr.onreadystatechange = function(e) {
            if (this.readyState == 4) {
                //if (this.status === 200) {
                    console.log(['xhr upload complete', e]);
                    showNotification();
                // }else {
                //     resetProgressBar();
                //     showNotification(true);
                // }
            }
        };
        xhr.open('post', config.uploadUrl, true);
        xhr.setRequestHeader("Content-Type","multipart/form-data");
        xhr.send(FormData);
    }

})();
