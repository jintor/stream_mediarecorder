<?php

if (isset($_REQUEST)) {

   include_once('clean.php');
  
	$stubslice_session = clean( $_REQUEST['stubslice_session'] ?? '' ) ;
	$stubslice_number = clean( $_REQUEST['stubslice_number'] ?? '' ) ;
	$stubslice_uint8 = clean( $_REQUEST['stubslice_uint8'] ?? '' ) ;

	if ( is_numeric($stubslice_number) && ( $stubslice_uint8 != '' ) ) {
		
		// WHERE TO SAVE CHUNKS
		$received_chunk_dir = INCLUDE_PATH_ROOT.'templates/tests_ubox_slice/streamslices/'.$stubslice_session;
		$received_chunk_jpg = $received_chunk_dir.'/'.$stubslice_session.$stubslice_number.'.jpg';
		$received_chunk_wep = $received_chunk_dir.'/'.$stubslice_session.$stubslice_number.'.webp';
		$received_previ_wep = $received_chunk_dir.'/'.$stubslice_session.($stubslice_number - 1).'.webp';
		$received_prev2_wep = $received_chunk_dir.'/'.$stubslice_session.($stubslice_number - 2).'.webp';
		$received_prev3_wep = $received_chunk_dir.'/'.$stubslice_session.($stubslice_number - 3).'.webp';
		$received_prev4_wep = $received_chunk_dir.'/'.$stubslice_session.($stubslice_number - 4).'.webp';
		$received_prev5_wep = $received_chunk_dir.'/'.$stubslice_session.($stubslice_number - 5).'.webp';
		$received_prev6_wep = $received_chunk_dir.'/'.$stubslice_session.($stubslice_number - 6).'.webp';
		$received_final_path = $received_chunk_dir.'/'.$stubslice_session.'.webm';
	
		// GET UINT
		$stubslix_rawuints = explode(',',$stubslice_uint8);
		
		if ( count($stubslix_rawuints) > 0 ) {
	
			// C PACK
			$binarydata = pack("C*", ...$stubslix_rawuints);
		
			// FIRST OR APPEND
			if ( file_exists($received_final_path) ) { $stubslix_append = "ab"; } else { mkdir($received_chunk_dir); $stubslix_append = "wb"; }
			$out = fopen($received_final_path,$stubslix_append); if ($out) { fwrite($out, $binarydata); fclose($out); }
		
			// SEGMENT JPG IN BACKGROUND TO AVOID ASYNC WAIT ON JAVASCRIPT SIDE
			if ( file_exists($received_final_path) && ($stubslice_number % 3 === 0) ) { 
				shell_exec('ffmpeg -ss '.$stubslice_number.' -i "'.$received_final_path.'" -hide_banner -vframes 1 "'.$received_chunk_wep.'" > /dev/null 2>&1 &'); 
			}
			
			// UPDATE PREVIEW
			if ( file_exists($received_prev3_wep) ) { echo '<div><img src="/templates/tests_ubox_slice/streamslices/'.$stubslice_session.'/'.$stubslice_session.($stubslice_number - 3).'.webp" height="199px" /></div>'; }
			elseif ( file_exists($received_prev4_wep) ) { echo '<div><img src="/templates/tests_ubox_slice/streamslices/'.$stubslice_session.'/'.$stubslice_session.($stubslice_number - 4).'.webp" height="199px" /></div>'; }
			elseif ( file_exists($received_prev5_wep) ) { echo '<div><img src="/templates/tests_ubox_slice/streamslices/'.$stubslice_session.'/'.$stubslice_session.($stubslice_number - 5).'.webp" height="199px" /></div>'; }
			elseif ( file_exists($received_prev6_wep) ) { echo '<div><img src="/templates/tests_ubox_slice/streamslices/'.$stubslice_session.'/'.$stubslice_session.($stubslice_number - 6).'.webp" height="199px" /></div>'; }
		
		}
	
    // LET JAVASCRIPT KNOW GO FOR NEXT SEGMENT
		echo '<script>stubsync_status = 1;</script>';
	
	}

}

?>
