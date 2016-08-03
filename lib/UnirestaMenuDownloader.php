<?php

require('MenuDownloader.php');

class UnirestaMenuDownloader extends MenuDownloader {
	public $url = 'http://www.uniresta.fi/ruokalistat/%s.json';
	public $restaurants = array(
		'kastari' => 'linnanmaa/kastari',
		'vanilla' => 'vanilla',
		'preludi' => 'preludi',
		'medisiina' => 'medisiina',
		'castanea' => 'castanea'
	);
	public $downloadFolder = '../static/data/uniresta/';
	
	public function download() {
		$currentWeek = date('Y-m-d', strtotime('this week', time()));

		foreach ($this->restaurants as $restaurant => $url) {
			$downloadUrl = sprintf($this->url, $url);
			file_put_contents($this->downloadFolder . $currentWeek . '_' . $restaurant . '.json', fopen($downloadUrl, 'r'));
		}
	}
}

if (php_sapi_name() == 'cli') {
	$downloader = new UnirestaMenuDownloader();
	$downloader->download();
	$downloader->clean();
}
