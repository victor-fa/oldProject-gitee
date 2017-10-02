
$().ready(function () {

    function ajaxOnFailed(){
        console.log("failed to find the image")
        $('#image-list-container').html("")  // set to empty
    }
    
    function ajaxOnSuccess(obj){
        console.log("get ajax response "+obj)
        // console.log(obj)
        var image_list = obj.photos
        console.log(image_list.length)
        var image_list_html = $('#image-list-container').html()
        $('#image-list-container').html("")  // set to empty
        // console.log("the html is"+image_list_html)
        var host_address = "http://localhost:10010/"

        for(photo in image_list){
            console.log("the file name is "+ image_list[photo].path)
            var actual_file_path = host_address+image_list[photo].src.replace(/\\/g,'\/')
            var image_item = "<image width = 100 height = 100 src = '" + actual_file_path+ "'></image>"
            
            console.log(image_item)
            // $('#image-container').append(image_item)
            var button_html = "<input type = 'submit' class = 'delete_button' name='delete_btn' value='删除'/>" +"<input type = 'hidden' name='album_name' value = "+ obj.name+"/>" +"<input type = 'hidden' name='file_name' value = " +image_list[photo].name + "/>"+ "<input type = 'hidden' name='file_path' value = " +image_list[photo].path+"/>" 
            var div_html ="<div width=100 height = 150 class='image-container' > <form class = 'delete-form' method= 'POST' action= ' /image/delete' encType='multipart/form-data'  >" + image_item + button_html + "</form></div>"
            $('#image-list-container').append(div_html)
            
            // $('.delete_button').click(function(e){
            //     e.preventDefault();
            //     console.log("click the delete button")
            //     console.log("delete the file with the name "+ $(this).attr('data-file_name'))
            //     let file_relative_path = $(this).attr('data-file_path')
            //     let file_name = file_relative_path.split('\/')[1]
            //     let album_name = file_relative_path.split('\/')[0]
            //     // ajax post the request to delete the file
            //     console.log(file_name)
            //     console.log(album_name)
            //     $.post('delete',{
            //         file_name: file_name,
            //         album_name: album_name,
            //         file_path : file_relative_path
            //     },function(data){
            //         console.log(data)
            //         // $('html').html(data)
            //         // location.reload()
            //     })
            // })
        
        }
    }

    console.log(username)   // username come from session info which is passed during the render
    // let album_name = $('#album_name').find(":selected").text()
    console.log(album_name)
    function reload_images(album_name){


        $.ajax({
            url: '../gallery/'+username+'_'+album_name,
            type: 'GET',
            success: ajaxOnSuccess,
            error: ajaxOnFailed
            // error: function(){
            //     console.log("未能找到图片")
            // }
        })
    }
    
    reload_images($('#album_name').find(":selected").text())

    $('#album_name').change(function(){
        let album_name = $('#album_name').find(":selected").text()
        reload_images(album_name)
    })


})
