import axios from 'axios';
import { UserFlags, UserFlagsBitField } from "discord.js";

(async () => {
    /*const url = 'https://ora.ai/api/conversation';
    const headers = {
      Cookie: 'silindi',
      Referer: 'https://ora.ai/embed/0abf38a7-1cb2-418d-a5a8-e4a61ed11eee',
    };
    
    const requestBody = {
      chatbotId: '0abf38a7-1cb2-418d-a5a8-e4a61ed11eee',
      input: 'bu isteği reddettim sunucunuz uygun değil',
      userId: 'auto:1b7063cd-6ba5-413f-8dc8-9b6a7c49007e',
      provider: 'OPEN_AI',
      config: false,
      includeHistory: false,
    };
    
    await axios.post(url, requestBody, { headers })
      .then(response => {
        console.log('Response:', response.data);
      })
      .catch(error => {
        console.error('Error:', error);
      });*/

    /* const r = await axios.get('https://discord.com/api/v8/oauth2/authorize?client_id=408785106942164992&scope=bot', {
         headers: {
             'Authorization': 'silindi-bot-token'
         }
     });
 
     console.log(new UserFlagsBitField(r.data.bot.public_flags).toArray())*/

    // Örnek bir dizi
    const myArray: string[] = ["a", "b", "c", "a", "d", "e", "b", "f", "g", "h", "i"];

    // İki kez tekrar eden öğeleri bulma
    function findDuplicates(array: string[]): string[] {
        const counts: { [key: string]: number } = {};
        const duplicates: string[] = [];

        for (let i = 0; i < array.length; i++) {
            const value: string = array[i];
            counts[value] = counts[value] ? counts[value] + 1 : 1;

            if (counts[value] === 2) {
                duplicates.push(value);
            }
        }

        return duplicates;
    }

    // Dizideki iki kez tekrar eden öğeleri çekme
    const duplicatedValues: string[] = findDuplicates(myArray);

    console.log("İki kez tekrar eden öğeler: ", duplicatedValues);



})();