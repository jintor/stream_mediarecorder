function stublog (e) { $("#stublog").show(); $("#stublog").append("<div>"+e+"<div>"); }
function stubprog (e) { $("#stubprogress").show(); $("#stubprogress").html("<div>"+e+"</div>"); }
function stubwait (e) { $("#stubwait").show(); $("#stubwait").html("<div>"+e+"</div>"); }

function successCallback(stream) { window.stream = stream; gumVideo.srcObject = stream; }

function errorCallback(error) { stubprog(error); }

function handleDataAvailable(event) {
	var reader = new FileReader();
	reader.readAsArrayBuffer(event.data); 
	reader.onloadend = async function(event) { 
		let arrayBuffer = reader.result; 
		let uint8View = new Uint8Array(arrayBuffer); 
		stubindex_insert(order,uint8View);
		order ++; 
	}
}

function stubindex_insert (stubid,stubdata) {
	var open = indexedDB.open(stubindex_table, 1);
	open.onsuccess = function() {
		var db = open.result;
		var tx = db.transaction(stubindex_objectstore, "readwrite");
		var store = tx.objectStore(stubindex_objectstore);
		store.put({id: stubid, uint8: stubdata});
		tx.oncomplete = function() { db.close(); };
	}
}

function stubindex_remove (stubid) {
	var open = indexedDB.open(stubindex_table, 1);
	open.onsuccess = function() {
		var db = open.result;
		var tx = db.transaction(stubindex_objectstore, "readwrite");
		var store = tx.objectStore(stubindex_objectstore);
		var stubget = store.delete(stubid);
	}
}

function stubindex_get (stubid) {
	var open = indexedDB.open(stubindex_table, 1);
	open.onsuccess = function() {
		var db = open.result;
		var tx = db.transaction(stubindex_objectstore, "readwrite");
		var store = tx.objectStore(stubindex_objectstore);
		var stubget = store.get(stubid);
		stubget.onsuccess = function() { 
			if ( stubget.result ) { 
				stubsync_status = 0; 
				var combinex = []; combinex["stubslice_session"] = encodeURIComponent(thissession); 
				combinex["stubslice_uint8"] = stubget.result.uint8.toString(); combinex["stubslice_number"] = stubid;
				stubajax("combiner",stubphp_receiver,combinex); 
				if ( (stubsync_sent == 1) && (stubsync_ffmpeg == 1) ) { stubajax("ffmpeg",stubphp_ffmpeghls,combinex); stubsync_ffmpeg = 0;  }
				stubindex_remove(stubid);
				stubsync_sent ++;
			}
		};
		var countRequest = store.count(); countRequest.onsuccess = function() { 
			if ( (stubsync_stop == 1) && (stubsync_sent > 1) && (countRequest.result == 0) ) { 
				clearInterval(stubperiodic_sync); 
				stubprog(lang_upload_complete);
				$("#stubwait").html("");
				$("#stubwait").hide();
			} 
		}
	}
}

function stubsync () { if ( stubsync_status == 1 ) { log(Date.now()+" sending "+stubsync_sent); stubindex_get(stubsync_sent); } }
