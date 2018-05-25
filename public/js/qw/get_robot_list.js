		$.ajax( {
				  type: 'post',
				  url: 'https://robot-service.centaurstech.com/api/admin/serverlist',
				  dataType: 'JSON',
 
				  success: function(data){
							build_dropdown( objKeySort(data), $( '#robot_radio_container' ));//填充表单
							},
				 } );
			
		 function objKeySort(arys) { 
                //先用Object内置类的keys方法获取要排序对象的属性名，再利用Array原型上的sort方法对获取的属性名进行排序，newkey是一个数组
                var newkey = Object.keys(arys).sort();　　 
                //console.log('newkey='+newkey);
                var newObj = {}; //创建一个新的对象，用于存放排好序的键值对
                for(var i = 0; i < newkey.length; i++) {
                    //遍历newkey数组
                    newObj[newkey[i]] = arys[newkey[i]]; 
                    //向新创建的对象中按照排好的顺序依次增加键值对

                }
                return newObj; //返回排好序的新对象
			}	
			
		String.prototype.temp = function (obj) {
			return this.replace(/\$\w+\$/gi, function (matches) {
				var ret = obj[matches.replace(/\$/g, "")];
				if (ret === "") {
					ret = "N/A";
				}
				return (ret + "") === "undefined" ? matches : ret;
			});
		}
		 var build_dropdown = function( data, element){
								   var currentKey=$("#robot").val().trim();
								   var tempRadioTemplate=$("#temp_radio_template").html();
								   var tempRadioTemplateChecked=$("#temp_radio_template_checked").html();
								  element.empty();
								  if( data ){
									$.each(data, function( key, value ){
											var obj={
												value:value
											};
											var radioHtml=(key==currentKey?tempRadioTemplateChecked:tempRadioTemplate).temp(obj);
											element.append(radioHtml);
										});
									}
								}