		$.ajax( {
				  type: 'post',
				  url: 'https://robot-service.centaurstech.com/api/admin/serverlist',
				  dataType: 'JSON',
 
				  success: function(data){
							build_dropdown( data, $( '#robot' ), '请选择...' );//填充表单
							},
				 } );
				 
		 var build_dropdown = function( data, element, defaultText ){
								  element.empty().append( '<option value="">' + defaultText + '</option>' );
								  if( data ){
								   $.each( data, function( key, value ){
										element.append( '<option value="' + key + '">' + value + '</option>' );
									   } );
									}
								}