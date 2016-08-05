<?php

require('MenuDownloader.php');

class AmicaMenuDownloader extends MenuDownloader {
	public $url = 'http://www.amica.fi/modules/json/json/Index?costNumber=%s&language=%s&firstDay=%s';
	public $languages = array(
		'fi',
		'en'
	);
	public $restaurants = array(
		//Linnanmaa
		'0273' => 'centralstation',
		'0274' => 'stories',
		'0275' => 'datagarage',
		'0271' => 'aava',
		'0272' => 'balance',
		//Keskusta
		'1694' => 'odl-kantakortteli',
		//Kontinkangas & Kaukovainio
		'0226' => 'alwari',
		'0235' => 'kotkanpoika-kultturelli',
		//Teknologiakylä
		'3498' => 'smarthouse',
		'3497' => 'garden'
	);
	public $downloadFolder = '../static/data/amica/';
	
	public function download() {
		$currentDay = date('w');
		$currentWeekStart = strtotime('-' . $currentDay + 1 . ' days');
		$nextWeekStart = strtotime('+ 7 days', $currentWeekStart);
		$dates = array(
			date('Y-n-j', $currentWeekStart),
			date('Y-n-j', $nextWeekStart)
		);

		foreach ($this->languages as $language) {
			foreach ($this->restaurants as $restaurantId => $restaurantName) {
				foreach ($dates as $date) {
					$downloadUrl = sprintf($this->url, $restaurantId, $language, $date);
					file_put_contents($this->downloadFolder . date('Y-m-d', strtotime($date)) . '_' . $language . '_' . $restaurantName . '.json', fopen($downloadUrl, 'r'));
				}
			}
		}
	}
}

if (php_sapi_name() == 'cli') {
	$downloader = new AmicaMenuDownloader();
	$downloader->download();
	$downloader->clean();
}
