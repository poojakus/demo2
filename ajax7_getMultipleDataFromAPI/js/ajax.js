// document.getElementById("btnn").addEventListener("Click",makeRequest);
function makeRequest()
{
    let tab=document.getElementById("table")
    console.log("Button Clicked");
    const xhr=new XMLHttpRequest()
    
    xhr.open("GET","https://jsonplaceholder.typicode.com/posts",true)
    xhr.responseType="json"

    xhr.onload=()=>
    {
        if(xhr.status===200)
        {
            // console.log(xhr.response)
            const data=xhr.response
           for (let i = 0; i < data.length; i++) {
            //    tab=xhr.response
            //    console.log(tab)
            tab.innerHTML += "<tr><td>"+ data[i].id +"</td><td>" + data[i].userId + 
            "</td><td>"+ data[i].title +"</td><td>"+ data[i].body +"</td></tr>"
                // console.log("data",data[i].userId);
                // document.getElementById("age").innerHTML=data[i].id
                // console.log("title=",data[i].title);
                // console.log("id=",data[i].id);
                // console.log("body=",data[i].body);
       
           }
            // console.log(xhr.responseText);
            // const obj=JSON.parse(xhr.response)
            // obj.name
            // document.getElementById("name").innerHTML=xhr.response.name
            // document.getElementById("age").innerHTML=xhr.response.age

        }
        else
        {
            console.log("problem occured....")
        }
    }
    xhr.send();
}
// alert("hello!")