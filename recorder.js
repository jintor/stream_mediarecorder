thissession = Date.now();
let order = 0;
var mediaRecorder;
var sourceBuffer;
var gumVideo = document.querySelector("video#gum");
var constraints = {  audio: true, video: true };

navigator.mediaDevices.getUserMedia( constraints ).then( successCallback, errorCallback );

function stublog (e) { $("#stublog").append(e+"<br>"); }
function stubprog (e) { $("#stuprogress").html(e+"<br>"); }
stublog ("snowi = "+snowi);

function successCallback(stream) { stublog("stream ok", stream); window.stream = stream; gumVideo.srcObject = stream; }
function errorCallback(error) { stublog(error); }
function stopRecording() { mediaRecorder.stop(); }

function handleDataAvailable(event) {
	var reader = new FileReader();
	reader.readAsArrayBuffer(event.data); 
	reader.onloadend = async function(event) { let arrayBuffer = reader.result; let uint8View = new Uint8Array(arrayBuffer); stubchunks(uint8View,order); order += 1; }
}

function stubchunks (uint8,uint8_order,uint8_divider = 33369) {
	
	// LENGHT OF uint8
	var uint8_length = uint8.length;
	var uint8_counter = 0;
	var uint8_howmany_loops = Math.round(parseInt(uint8.length) / uint8_divider);
	var uint8_howmany_xloops = parseInt(uint8_howmany_loops) + 1;
		
	if ( (uint8_length > 0) && (uint8_length <= uint8_divider) ) { 
		var combinex = []; combinex["thissession"] = encodeURIComponent(thissession); combinex["uint8_order"] = encodeURIComponent(uint8_order); 
		combinex["stubslice_uint8"] = uint8; combinex["uint8_length"] = uint8_length; combinex["uint8_divider"] = uint8_divider; 
		stubajax("combiner","/templates/tests_ubox_slice/streamrtc_deslicer.php?pcache="+thissession,combinex,"append"); 
	} else {
		for (var loop = 0; loop <= uint8_howmany_xloops; loop++) {
			var stubslice = uint8.slice(uint8_counter, (parseInt(uint8_counter) + uint8_divider + 1)); 
			for (var iter = 0; iter <= uint8_divider; iter++) { uint8_counter ++; }
			if (stubslice.length > 0) {
				var combinex = []; combinex["thissession"] = encodeURIComponent(thissession); 
				combinex["uint8_order"] = encodeURIComponent(uint8_order); combinex["stubslice_uint8"] = stubslice; combinex["stubslice_number"] = loop; 
				combinex["stubslice_quantity"] = uint8_howmany_loops; combinex["uint8_length"] = uint8_length; combinex["uint8_divider"] = uint8_divider; 
				// stubajax is there : https://github.com/jintor/stubajax/blob/main/stubajax.js
        stubajax("combiner","/templates/tests_ubox_slice/streamrtc_deslicer.php?pcache="+thissession,combinex,"append");
			}
		}
	}
	
}

function startRecording() {
  try { mediaRecorder = new MediaRecorder(window.stream); } catch (e0) { stublog("Unable to create MediaRecorder with codec"); return false; }
  mediaRecorder.ondataavailable = handleDataAvailable;
  mediaRecorder.start(3000);
  stublog("MediaRecorder started");  
}
