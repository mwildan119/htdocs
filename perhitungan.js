var list_package 	= [];
var list_harga 		= [];
$('#G-Game').on('change',function(){
	val = $(this).val();
	if(val == 'ff'){
		list_package 	= ff_package;
		list_harga 		= ff_harga;
	}else if(val == 'pubg'){
		list_package 	= pubg_package;
		list_harga 		= pubg_harga;
	}else if(val == 'ml'){
		list_package 	= ml_package;
		list_harga 		= ml_harga;
	}else{
		list_package 	= [];
		list_harga 		= [];
	}
	reset_value('Game');

	item 	= '';
	item2 	= '';
	for (var i = 0; i < list_package.length; i++) {
		item += '<option class="dt" value="'+i+'">'+list_package[i]+'</option>';
		if(i != 0){
			item2 += '<option class="dt" value="'+i+'">'+list_package[i]+'</option>';
		}
	}
	$('#G-From').append(item);
	$('#G-To').append(item2);

});

$('#G-From').on('change',function(){
	sum_total();
});
$('#G-To').on('change',function(){
	sum_total();
});
$('#G-Fee-Type').on('change',function(){
	sum_total();
});
$('#G-Reseller').change(function () {
    sum_total();
 });

function sum_total(){
	from 		= $('#G-From option:selected').val();
	to 			= $('#G-To option:selected').val();
	fee_type 	= $('#G-Fee-Type option:selected').val();
	reseller 	= $('#G-Reseller:checked').val();

	status_perhitungan = true;
	if(from == 'none' || to == 'none' || to<from){
		status_perhitungan = false;
		reset_value('From');
	}

	if(status_perhitungan){
		index_no = to-from;
		val = list_harga[from][index_no];
		val = val.replace(/,/g,'');
		val = parseFloat(val);

		val_fee = 0;
		if(fee_pembayaran[fee_type]){
			val_fee_temp = fee_pembayaran[fee_type];
			val_fee_temp = val_fee_temp.split('-');
			if(val_fee_temp[0] == '%'){
				val_fee_temp = val_fee_temp[1];
				val_fee      = parseFloat(val_fee_temp);
				val_fee 	 = PersenttoRp(val,val_fee);
			}else{
				val_fee = val_fee_temp[0];
				val_fee = val_fee.replace(/,/g,'');
				val_fee = parseFloat(val_fee);
			}
		}

		val_reseller = 0;
		if(reseller == 1){
			status_reseller  	= false;
			val_reseller_temp 	= '0';
			$.each(key_diskon_reseller,function(k,v){
				if(val>=v){
					status_reseller 	= true;
					val_reseller_temp  	= diskon_reseller[''+v];
					return false;
				}
			});
			if(status_reseller){
				val_reseller_temp = val_reseller_temp.split('-');
				if(val_reseller_temp[0] == '%'){
					val_reseller_temp = val_reseller_temp[1];
					val_reseller      = parseFloat(val_reseller_temp);
					val_reseller 	 = PersenttoRp(val,val_reseller);
				}else{
					val_reseller = val_reseller_temp[0];
					val_reseller = val_reseller.replace(/,/g,'');
					val_reseller = parseFloat(val_reseller);
				}
			}
		}


		$('#G-Fee-Package').val(formatRupiah(''+val,'IDR '));
		$('#G-Fee-Via').val(formatRupiah(''+val_fee,'IDR '));
		if(val_reseller>0){
			$('#G-Fee-Reseller').val(formatRupiah(''+val_reseller,'IDR -'))
		}else{
			$('#G-Fee-Reseller').val('IDR 0');
		}
		total = (val+val_fee)-val_reseller;
		$('#TotalPrice').text(formatRupiah(''+total,'IDR '));
	}
}

function show_console(p1){
	console.log(p1);
}

function reset_value(p1){
	if(p1 == 'Game'){
		$('#G-From .dt').remove();
		$('#G-To .dt').remove();
		$('#G-Fee-Package').val(formatRupiah(''+0,'IDR '));
		$('#G-Fee-Via').val(formatRupiah(''+0,'IDR '));
		$('#G-Fee-Reseller').val(formatRupiah(''+0,'IDR '));
		$('#TotalPrice').val(formatRupiah(''+0,'IDR '));
	}
	if(p1 == 'From' || p1 == 'To'){
		$('#G-Fee-Package').val(formatRupiah(''+0,'IDR '));
		$('#G-Fee-Via').val(formatRupiah(''+0,'IDR '));
		$('#G-Fee-Reseller').val(formatRupiah(''+0,'IDR '));
		$('#TotalPrice').text(formatRupiah(''+0,'IDR '));
	}
}

function formatRupiah(angka, prefix){
	var number_string = angka.replace(/[^,\d]/g, '').toString(),
	split   		= number_string.split(','),
	sisa     		= split[0].length % 3,
	rupiah     		= split[0].substr(0, sisa),
	ribuan     		= split[0].substr(sisa).match(/\d{3}/gi);

	// tambahkan titik jika yang di input sudah menjadi angka ribuan
	if(ribuan){
		separator = sisa ? ',' : '';
		rupiah += separator + ribuan.join(',');
	}

	rupiah = split[1] != undefined ? rupiah + '.' + split[1] : rupiah;
	return prefix == undefined ? rupiah : (rupiah ? prefix+'' + rupiah : '');
}

function PersenttoRp(total,persen){
  total  = parseFloat(total);
  persen = parseFloat(persen);
  hasil = (persen/100)*total;
  return hasil;
}