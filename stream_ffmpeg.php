<?php

if (isset($_REQUEST)) {

  include_once('clean.php');
  
	$stubslice_session = clean( $_REQUEST['stubslice_session'] ?? '' ) ;
	$stubslice_number = clean( $_REQUEST['stubslice_number'] ?? '' ) ;

	if ( $stubslice_session != '' ) {
		
		// WHERE TO SAVE CHUNKS
		$received_chunk_dir = INCLUDE_PATH_ROOT.'templates/tests_ubox_slice/streamslices/'.$stubslice_session;
		$received_final_path = $received_chunk_dir.'/'.$stubslice_session.'.webm';
		$received_final_wep = $received_chunk_dir.'/'.$stubslice_session.'.webp';
	
		// FIRST JPG
		if ( !file_exists($received_final_wep) ) { shell_exec('ffmpeg -i "'.$received_final_path.'" -hide_banner -vframes 1 "'.$received_final_wep.'" > /dev/null 2>&1 &'); }
		
    // START ENCODING UNIVERSALLY PLAYABLE .m3u8 (HLS)
    // -threads 4 -c:v libx264 -movflags +dash -preset slow -tune film -pix_fmt yuv420p -c:a aac -b:a 192k -ac 2 -profile:v high -b:v 2369k 
    // -fflags nobuffer -flags low_delay -vf "scale=-2:1080"
    // -bufsize 969k -hls_time 9 -hls_list_size 0 -g 30 -start_number 0 -streaming 1 -hls_playlist 1 -lhls 1 -hls_playlist_type event -f hls
    
    // START A SCRIPT IN BACKGROUND TO SEND TO FILEBASE.COM OR ANY S3 BUCKET
    
	}

}

?>
