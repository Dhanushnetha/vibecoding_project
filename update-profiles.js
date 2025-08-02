const fs = require('fs');

// Read the profiles.json file
const data = JSON.parse(fs.readFileSync('data/profiles.json', 'utf8'));

// Add isManager: false to all associates
data.associates.forEach(associate => {
  if (!associate.hasOwnProperty('isManager')) {
    associate.isManager = false;
  }
});

// Add isManager: true to all project managers
data.projectManagers.forEach(pm => {
  if (!pm.hasOwnProperty('isManager')) {
    pm.isManager = true;
  }
});

// Write back to file
fs.writeFileSync('data/profiles.json', JSON.stringify(data, null, 2));
console.log('Added isManager property to all users successfully!'); 