// document.getElementById("btnn").addEventListener("Click",makeRequest);
function makeRequest()
{
    console.log("Button Clicked");
    const xhr=new XMLHttpRequest()
    
    xhr.open("GET","data.txt",true)
    xhr.timeout=2000;
    xhr.onload=()=>
    {
        if(xhr.status===200)
        {
            console.log(xhr)
            console.log(xhr.responseText);
            document.getElementById("da").innerHTML=xhr.responseText

        }
        else
        {
            console.log("problem occured....")
        }
    }
    xhr.send();
}
// alert("hello!")