// document.getElementById("btnn").addEventListener("Click",makeRequest);
function makeRequest()
{
    console.log("Button Clicked");
    const xhr=new XMLHttpRequest()
    
    xhr.open("GET","data.txt",true)
    xhr.timeout=2000;
    // xhr.onreadystatechange=function()
    // {
    //     if(xhr.status===200)
    //     {
    //         console.log(xhr)
    //         console.log(xhr.responseText);
    //         document.getElementById("da").innerHTML=xhr.responseText

    //     }
    //     else
    //     {
    //         console.log("problem occured....")
    //     }
    // }
    // xhr.send();
    xhr.onload=function()
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
    xhr.onprogress=function(e)
    {
        console.log(e.loaded);
        console.log(e.total)
    }
    xhr.onerror=function()
    {
        console.log("Network Not anvailabe")
    }
    xhr.onloadstart=function()
    {
        console.log("Transaction Has Stratred...")
    }
    xhr.onloadend=()=>
    {
        console.log("Transaction End....")
    }
    xhr.onabort=()=>
    {
        console.log("On Abort..")
    }
    xhr.ontimeout=()=>
    {
        console.log("TIme out...")
    }
    xhr.send();
}
// alert("hello!")