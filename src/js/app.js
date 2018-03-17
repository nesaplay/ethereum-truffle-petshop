App = {
  web3Provider: null,
  contracts: {},

  init: function() {
    // Load pets.
    $.getJSON('../pets.json', function(data) {
      var petsRow = $('#petsRow');
      var petTemplate = $('#petTemplate');

      for (i = 0; i < data.length; i ++) {
        petTemplate.find('.panel-title').text(data[i].name);
        petTemplate.find('img').attr('src', data[i].picture);
        petTemplate.find('.pet-breed').text(data[i].breed);
        petTemplate.find('.pet-age').text(data[i].age);
        petTemplate.find('.pet-location').text(data[i].location);
        petTemplate.find('.btn-adopt').attr('data-id', data[i].id);

        petsRow.append(petTemplate.html());
      }
    });

    return App.initWeb3();
  },

  initWeb3: function() {
    if (typeof web3 !== 'undefined') {
      App.web3Provider = web3.currentProvider;
    } else {
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
    }

    web3 = new Web3(App.web3Provider);

    return App.initContract();
  },

  initContract: function() {
    $.getJSON('Adoption.json', function(artifact) {
      App.contracts.Adoption = TruffleContract(artifact);

      App.contracts.Adoption.setProvider(App.web3Provider);
      return App.markAdopted();
    })

    return App.bindEvents();
  },

  bindEvents: function() {
    $(document).on('click', '.btn-adopt', App.handleAdopt);
  },

  markAdopted: function(adopters, account) {
    App.contracts.Adoption.deployed()
      .then(function(instance) {
        return instance.getAdopters.call();
      })
      .then(function(adopters) {
        for (let i = 0; i < adopters.length; i++) {
          if (adopters[i] !== '0x0000000000000000000000000000000000000000') {
            $('.panel-pet').eq(i).find('button').text('Success').attr('disabled', true);
          }
        }
      })
      .catch(function(err) {
        console.warn(err.message);
      })
  },

  handleAdopt: function(event) {
    event.preventDefault();

    let petId = parseInt($(event.target).data('id'));

    web3.eth.getAccounts(function(err, accounts) {
      if (err) console.warn(err);

      const account = accounts[0];

      App.contracts.Adoption.deployed()
        .then(function(instance) {
        return instance.adopt(petId, {from: account})
        })
        .then(function(result) {
          return App.markAdopted();
        })
        .catch(function(err) {
          console.warn(err.message)
        })
    })
  }

};

$(function() {
  $(window).load(function() {
    App.init();
  });
});
