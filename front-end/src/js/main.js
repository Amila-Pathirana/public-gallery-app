const  btnUpload =$("header div button");
const overlayElm=$("#overlay");
const dropElm =$("#drop-area");
const mainElm =$("main");
const REST_API_URL="http://localhost:8080/gallery";
const cssLoaderHtml = `<div class="lds-facebook"><div></div><div></div><div></div></div>`;

loadAllImages();


btnUpload.on("click",()=>{
    overlayElm.removeClass("d-none");
});
overlayElm.on('click',(eventData)=>{
    if(eventData.target===overlayElm[0]){
        overlayElm.addClass('d-none');
    }
});
$(document).on('keydown',(eventData)=>{
    if(eventData.key==='escape' && !overlayElm.hasClass('d-none')){
        overlayElm.addClass('d-none');
    }
});

overlayElm.on('dragover',(eventData)=>{
    eventData.preventDefault();
});
overlayElm.on('drop',(eventData)=>{
    eventData.preventDefault();
});
dropElm.on('drop',(eventData)=>{
    eventData.preventDefault();
    console.log(eventData)
    const dropFiles = eventData.originalEvent.dataTransfer.files;
    const imageFiles= Array.from(dropFiles).filter(file=>file.type.startsWith("image/"));
    if(!imageFiles.length) return;
    overlayElm.addClass('d-none');
    uploadImages(imageFiles);
});
mainElm.on('click','.image #download',(eventData)=>{
    let imageUrl = $(eventData.target).parents('.image').css('background-image');
    var split = imageUrl.split("/");
    imageName=split[split.length-1].substring(0,split[split.length-1].length-2)
    console.log(imageName);
    download(imageName);
});
mainElm.on('click','.image #delete',(eventData)=>{
    let imageUrl = $(eventData.target).parents('.image').css('background-image');
    var split = imageUrl.split("/");
    imageName=split[split.length-1].substring(0,split[split.length-1].length-2);
    console.log(imageName)
    deleteFile(imageName,$(eventData.target).parents('.image'));
})

function uploadImages(images){
    const formData=new FormData();
    images.forEach(imageFile=>{
        const divElm =$('<div class="image loader"></div>');
        mainElm.append(divElm);
        formData.append("images",imageFile);

    });
    const jqxhr =$.ajax(`${REST_API_URL}/api/v1/images`,{
        method:'POST',
        crossDomain:true,
        data:formData,
        contentType:false, //by default jquery use application/x-www-form-urlencoded;
        processData:false //by default jquery try to convert data intoString;
    });
    jqxhr.done((imageList)=>{
        imageList.forEach(imageUrl=>{
            const divElm =$(".image.loader").first();

            divElm.removeClass('loader');
            divElm.css('background-image',`url('${imageUrl}')`);

        });
    });

}
function loadAllImages(){
    const jqxhr =$.ajax(`${REST_API_URL}/api/v1/images`,'GET');
    jqxhr.done((imageList)=>{
        imageList.forEach(imageUrl=>{
            const divElm =$('<div class="image"></div>');

            divElm.css('background-image',`url(${imageUrl})`);

            mainElm.append(divElm);
        });
    });
}


