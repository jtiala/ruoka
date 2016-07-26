<?php

require('MenuDownloader.php');

class UnirestaMenuDownloader extends MenuDownloader {
	public $url = 'http://www.uniresta.fi/ruokalistat/linnanmaa/%s.xml';
	public $restaurants = array(
		'kastari'
	);
	public $downloadFolder = '../static/data/uniresta/';
	
	public function download() {
		$currentWeek = date('Y-m-W');

		foreach ($this->restaurants as $restaurant) {
			$downloadUrl = sprintf($this->url, $restaurant);
			file_put_contents($this->downloadFolder . $currentWeek . '_' . $restaurant . '.xml', fopen($downloadUrl, 'r'));
		}
	}
}

if (php_sapi_name() == 'cli') {
	$downloader = new UnirestaMenuDownloader();
	$downloader->download();
	$downloader->clean();
}
