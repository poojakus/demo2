// document.getElementById("btnn").addEventListener("Click",makeRequest);
function makeRequest()
{
    console.log("Button Clicked");
    const xhr=new XMLHttpRequest()
    
    xhr.open("GET","data.txt",true)
    xhr.withCredentials=true
    xhr.responseType="text"
    xhr.onload=function()
    {
        if(xhr.status===200)
        {
            console.log(xhr)
            console.log("XHR RESPONSE TEXT=",xhr.responseText);
            console.log("xhr status Text=",xhr.statusText);
            console.log("xhr response=",xhr.response);
            console.log("xhr response url=",xhr.responseURL);
            console.log("xhr response type=",xhr.responseType);
            console.log("xhr get response herder=",xhr.getAllResponseHeaders);
            console.log("xhr with crendials=",xhr.withCredentials);
            console.log("get all response headers=",xhr.getAllResponseHeaders("LAST-Modified"));
            console.log("respnse text=",xhr.responseText);
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