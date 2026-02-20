function rollDice(){
    let Num = document.getElementById("Num").value;
    let ImgResult = document.getElementById("ImgResult");
    let NumResult = document.getElementById("NumResult");

    let values = [];
    let image = [];

    for(let i = 0; i < Num; i++){
        let value = Math.floor(Math.random() * 6) + 1;
        values.push(value);
        image.push(`<img src="image/${value}.png" alt="Dice ${value}" height="250px">`);
    }
    NumResult.textContent = `dice: ${values.join(`, `)}`;
    ImgResult.innerHTML = image.join(` `)
}