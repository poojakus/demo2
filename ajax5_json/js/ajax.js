// document.getElementById("btnn").addEventListener("Click",makeRequest);
function makeRequest()
{
    console.log("Button Clicked");
    const xhr=new XMLHttpRequest()
    
    xhr.open("GET","https://jsonplaceholder.typicode.com/posts/1",true)
    xhr.responseType="json"

    xhr.onload=()=>
    {
        if(xhr.status===200)
        {
            console.log(xhr.response)
            // console.log(xhr.responseText);
            // const obj=JSON.parse(xhr.response)
            // obj.name
            document.getElementById("name").innerHTML=xhr.response.body
            document.getElementById("age").innerHTML=xhr.response.title

        }
        else
        {
            console.log("problem occured....")
        }
    }
    xhr.send();
}
// alert("hello!")