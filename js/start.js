var bgAudio;
function onStart() {
    var container = document.getElementById("container");
    document.body.removeChild(container);

    var animationCanvas = document.createElement("CANVAS");
    animationCanvas.width = 960;
    animationCanvas.height = 560;
    animationCanvas.tabIndex = 2;
    animationCanvas.id = "animation";
    animationCanvas.style.zIndex = "-10";
    document.body.appendChild(animationCanvas);

    var canvas = document.createElement("CANVAS");
    canvas.width = 960;
    canvas.height = 560;
    canvas.tabIndex = 1;
    canvas.id = "scene";
    canvas.style.zIndex = "2";
    document.body.appendChild(canvas);

    bgAudio = document.createElement("audio");
    bgAudio.src="sound/bg.mp3";
    bgAudio.autoplay ="autoplay";
    bgAudio.loop = "loop";
    bgAudio.volume = 0.05;
    document.body.appendChild(bgAudio);

    main();


    // $( "#dialog_next_level" ).dialog({
    //     "modal":true,
    //     "width":960,
    //     "height":560,
    //     "resizable":false,
    //     "draggable":false,
    //    "position":{"my":"center","at":"center","of":"#dialog_next_level"},
    //     open: function (event, ui) {
    //         $(".ui-dialog-titlebar", $(this).parent()).hide(),
    //         $(".ui-dialog-titlebar-close", $(this).parent()).hide();
    //     }
    // });
}
function onClose() {
    localCloseVBox();
}
