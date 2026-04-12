const bcrypt = require('bcryptjs');

bcrypt.hash('indonesiaemas2045', 10).then(hash => {
    console.log('\n=======================================');
    console.log('HASIL HASH PASSWORD:');
    console.log(hash);
    console.log('=======================================\n');
});
