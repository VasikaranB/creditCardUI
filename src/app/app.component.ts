import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'CreditCardUI';

  cardNumber = '';
  masked = '#### #### #### ####';
  cardName = '';
  cardType = '';
  month = '';
  months = [
    '01',
    '02',
    '03',
    '04',
    '05',
    '06',
    '07',
    '08',
    '09',
    '10',
    '11',
    '12',
  ];
  monthDisplay = [...this.months];
  year = null;
  years: Array<number> = [];
  years1: Array<number> = [];
  years2: Array<number> = [];
  cvv = null;
  currentMonth = 0;
  currentYear = 0;

  flipped = false;
  imagePath = 'assets/images/visa.png';

  ccForm!: FormGroup;

  constructor(private router: Router) {
    this.ccForm = new FormGroup({
      cardNumber: new FormControl('', [Validators.required]),
      cardName: new FormControl('', [Validators.required]),
      month: new FormControl('', Validators.required),
      year: new FormControl('', Validators.required),
      cvv: new FormControl('', [Validators.required, Validators.minLength(3)]),
    });
  }

  ngOnInit() {
    this.currentYear = new Date().getFullYear();
    let yearList = [];
    for (let i = this.currentYear; i <= this.currentYear + 20; i++) {
      yearList.push(i);
    }
    this.years1 = [...yearList];
    this.years = [...yearList];
    this.years2 = [...yearList];
    this.years2.shift();
    this.currentMonth = new Date().getMonth();
  }

  // to flip the cc image
  flipCard() {
    this.flipped = this.flipped ? false : true;
  }

  // to change year list based on month
  changeMonth(month: any) {
    this.ccForm.controls['month'].setValue(month);
    this.month = month;
    if (parseInt(month) < this.currentMonth) {
      this.years = this.years2;
    } else {
      this.years = this.years1;
    }
  }

  // to validate year and change monthlist
  changeYear(year: any) {
    this.ccForm.controls['year'].setValue(year);
    this.year = year.toString().substring(2);
    if (parseInt(year) === this.currentYear) {
      this.monthDisplay = this.months.slice(this.currentMonth);
    } else {
      this.monthDisplay = this.months;
    }
  }

  // to validate CVV
  manageCVV(e: any) {
    if (
      (e.keyCode !== 8 &&
        e.keyCode !== 9 &&
        e.keyCode !== 13 &&
        e.keyCode !== 37 &&
        e.keyCode !== 39 &&
        e.keyCode !== 0 &&
        e.keyCode < 48) ||
      e.keyCode > 57
    ) {
      e.preventDefault();
    }
    this.cvv = e.target.value.replace(/\d/g, '*');
  }

  // to validate card number
  manageCardNumber(e: any) {
    this.cardType = this.getCardType(e.target.value);
    if (this.cardType === 'MASTERCARD') {
      this.imagePath = 'assets/images/mastercard.png';
    } else if (this.cardType === 'AMEX') {
      this.imagePath = 'assets/images/amex.png';
    } else if (this.cardType === 'MAESTRO') {
      this.imagePath = 'assets/images/troy.png';
    } else if (this.cardType === 'RUPAY') {
      this.imagePath = 'assets/images/jcb.png';
    } else {
      this.imagePath = 'assets/images/visa.png';
    }
    this.cardNumber = e.target.value;
    if (e.target.value.length > 4) {
      this.cardNumber =
        e.target.value.substr(0, 4) +
        e.target.value.substr(4, 10).replace(/\d/g, '*') +
        e.target.value.substr(14);
    }
  }

  // Util function provided for cardtype
  getCardType(cardNum: any) {
    cardNum = cardNum.split(' ').join('');
    let payCardType = '';
    let regexMap = [
      { regEx: /^4[0-9]{5}/gi, cardType: 'VISA' },
      { regEx: /^5[1-5][0-9]{4}/gi, cardType: 'MASTERCARD' },
      { regEx: /^3[47][0-9]{3}/gi, cardType: 'AMEX' },
      { regEx: /^(5[06-8]\d{4}|6\d{5})/gi, cardType: 'MAESTRO' },
    ];

    for (let j = 0; j < regexMap.length; j++) {
      if (cardNum.match(regexMap[j].regEx)) {
        payCardType = regexMap[j].cardType;
        break;
      }
    }

    if (
      cardNum.indexOf('50') === 0 ||
      cardNum.indexOf('60') === 0 ||
      cardNum.indexOf('65') === 0
    ) {
      const g = '508500-508999|606985-607984|608001-608500|652150-653149';
      let i = g.split('|');
      for (let d = 0; d < i.length; d++) {
        let c = parseInt(i[d].split('-')[0], 10);
        let f = parseInt(i[d].split('-')[1], 10);
        if (
          cardNum.substr(0, 6) >= c &&
          cardNum.substr(0, 6) <= f &&
          cardNum.length >= 6
        ) {
          payCardType = 'RUPAY';
          break;
        }
      }
    }
    return payCardType;
  }

  pay() {
    // routing to next page
  }
}
