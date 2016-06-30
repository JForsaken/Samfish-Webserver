var form = $('#connect_form');
var clientName = $('#clientName');
var invalidConnection = $('#invalidConnection');
var invalidLocation = $('#invalidLocation');
var validLocation = $('#validLocation');
var failedLocation = $('#failedLocation');
var noMovie = $('#noMovie');
var searchPage = $('#searchPage');
var searchTable = $('#searchTable');
var searchBtn = $('#searchBtn');
var addCriteriaBtn = $('#addCriteriaBtn');
var doSearchBtn = $('#doSearchBtn');
var resultTable = $('#resultTable').DataTable({
  "columnDefs":[
    {
      "targets":[0],
      "visible":false,
      "searchable":false
    }]
});

$(document).ready(function() {
  
  searchBtn.click(function() {
    searchPage.show();
  });

  doSearchBtn.click(function(){
    let params = getSearchParams();
    noMovie.hide();
    waitingDialog.show();
    resultTable.clear().draw();

    $.ajax({
      method: 'POST',
      url: './search',
      data: params,
    })
      .done(function(films) {
        addFilms(films);
      })
      .fail(function(err){
        console.log(err);
        noMovie.show();
      })
      .always(function(){
        waitingDialog.hide();
      });
  });

  addCriteriaBtn.click(function(){
    addCriteria();
  });

  invalidConnection.children('a').click(function(event) {
    event.preventDefault();
    invalidConnection.hide();
  });

  invalidLocation.children('a').click(function(event) {
    event.preventDefault();
    invalidLocation.hide();
  });

  validLocation.children('a').click(function(event) {
    event.preventDefault();
    validLocation.hide();
  });

  failedLocation.children('a').click(function(event) {
    event.preventDefault();
    failedLocation.hide();
  });

  noMovie.children('a').click(function(event) {
    event.preventDefault();
    noMovie.hide();
  });

  form.submit(function(event) {
    event.preventDefault();

    $.ajax({
      method: 'POST',
      url: './connect',
      data: {
        email: $("input[placeholder='Email']").val(),
        password: $("input[placeholder='Password']").val(),
      },
    })
      .done(function(client) {
        if (client) {
          sessionStorage.setItem('client', JSON.stringify(client));
          form.hide();
          clientName.html(client.prenom + ' ' + client.nom).parent().show();
        }
      })
      .fail(function() {
        invalidConnection.show();
      });
  });

  let client = JSON.parse(sessionStorage.getItem('client'));
  if (client) {
    form.hide();
    clientName.html(client.prenom + ' ' + client.nom).parent().show();
  }
  else {
    form.show();
  }

});

function addCriteria()
{
  let divParent = $('<div class="col-md-12" style="margin-bottom: 10px;">');
  let divDelete = $('<div class="col-md-1">');
  divParent.append(divDelete);
  let divCriteria = $('<div class="col-md-5">');
  divParent.append(divCriteria);
  let divValues = $('<div class="col-md-6">');
  divParent.append(divValues);

  let deleteBtn = $('<button class="btn btn-danger btn-xs" style="margin-top:7px">X</button>')
  divDelete.append(deleteBtn);
  deleteBtn.click(function(){
    $(this).parent().parent().remove();
    checkMissingCriteria();
  });

  let select = $('<select class="criteria form-control">');
  divCriteria.append(select);

  if(searchTable.find('option[value=titre]:selected').length == 0)
    select.append($('<option value="titre">Titre</option>'));

  if(searchTable.find('option[value=annee]:selected').length == 0)
    select.append($('<option value="annee">Année</option>'));

  if(searchTable.find('option[value=langue]:selected').length == 0)
    select.append($('<option value="langue">Langue</option>'));

  select.append($('<option value="pays">Pays</option>'));
  select.append($('<option value="genre">Genre</option>'));
  select.append($('<option value="realisateur">Réalisateur</option>'));
  select.append($('<option value="acteur">Acteur</option>'));
  select.change(changeType);
  select.trigger('change');
  searchTable.append(divParent);
}

function changeType(event)
{
  $(this).parent().next().empty();

  if($(this).val() === 'titre')
    $(this).parent().next().append($('<input type="text" class="form-control" placeholder="Titre">'));

  if($(this).val() === 'annee')
  {
    let div1 = $('<div class="col-md-6">');
    div1.append($('<input type="number" value="1900" class="form-control">'));
    let div2 = $('<div class="col-md-6">');
    div2.append($('<input type="number" value="2016" class="form-control">'));
    $(this).parent().next().append(div1, div2);
  }

  if($(this).val() === 'langue')
    $(this).parent().next().append(createDBSelect('langues'));

  if($(this).val() === 'pays')
    $(this).parent().next().append(createDBSelect('pays'));

  if($(this).val() === 'genre')
    $(this).parent().next().append(createDBSelect('genres'));

  if($(this).val() === 'realisateur')
  {
    let div1 = $('<div class="col-md-6">');
    div1.append($('<input type="text" class="form-control" placeholder="Prénom réalisateur">'));
    let div2 = $('<div class="col-md-6">');
    div2.append($('<input type="text" class="form-control" placeholder="Nom réalisateur">'));
    $(this).parent().next().append(div1, div2);
  }

  if($(this).val() === 'acteur')
  {
    let div1 = $('<div class="col-md-6">');
    div1.append($('<input type="text" class="form-control" placeholder="Prénom acteur">'));
    let div2 = $('<div class="col-md-6">');
    div2.append($('<input type="text" class="form-control" placeholder="Nom acteur">'));
    $(this).parent().next().append(div1, div2);
  }

  checkMissingCriteria();
  checkExtraCriteria();
}

function checkExtraCriteria()
{
  if(searchTable.find('option[value=titre]:selected').length == 1)
  {
    searchTable.children().children().children('select.criteria').each(function(index, select){
      $(select).children('option[value=titre]:not(:selected)').remove();
    });
  }

  if(searchTable.find('option[value=annee]:selected').length == 1)
  {
    searchTable.children().children().children('select.criteria').each(function(index, select){
      $(select).children('option[value=annee]:not(:selected)').remove();
    });
  }

  if(searchTable.find('option[value=langue]:selected').length == 1)
  {
    searchTable.children().children().children('select.criteria').each(function(index, select){
      $(select).children('option[value=langue]:not(:selected)').remove();
    });
  }
}

function checkMissingCriteria()
{
  if(searchTable.find('option[value=titre]:selected').length == 0)
  {
    searchTable.children().children().children('select.criteria').each(function(index, select){
      if($(select).find('option[value=titre]').length == 0)
      {
        $(select).append($('<option value="titre">Titre</option>'));
      }
    });
  }

  if(searchTable.find('option[value=annee]:selected').length == 0)
  {
    searchTable.children().children().children('select.criteria').each(function(index, select){
      if($(select).find('option[value=annee]').length == 0)
      {
        $(select).append($('<option value="annee">Année</option>'));
      }
    });
  }

  if(searchTable.find('option[value=langue]:selected').length == 0)
  {
    searchTable.children().children().children('select.criteria').each(function(index, select){
      if($(select).find('option[value=langue]').length == 0)
      {
        $(select).append($('<option value="langue">Langue</option>'));
      }
    });
  }
}

function createDBSelect(table)
{
  var select = $('<select class="form-control">');

  $.ajax({
    method: 'GET',
    url: './' + table,
  })
    .done(function(data) {
      data.forEach(function(line){
        select.append($('<option value="' + line[Object.keys(line)[0]] + '">'+ line.nom + '</option>'))
      });
    });

  return select;
}

function getSearchParams()
{
  let params = {};

  searchTable.children().children().children('select.criteria').each(function(index, select){

    let criteria = $(select).val();

    if(criteria === 'titre') {
      let titre = $($(select).parent().next().children()[0]).val();

      if(titre) {
        params.titre = titre;
      }
    }

    if(criteria === 'annee') {

      let annee1 = $($(select).parent().next().children().children()[0]).val();
      let annee2 = $($(select).parent().next().children().children()[1]).val();
      let annees;

      if( annee1 > annee2 ) {
        annees = [annee2+'-01-01', annee1+'-01-01'];
      }
      else {
        annees = [annee1+'-01-01', annee2+'-01-01'];
      }

      params.annees = annees;
    }

    if(criteria === 'langue') {
      params.langue = parseInt($($(select).parent().next().children()[0]).val());
    }

    if(criteria === 'pays') {
      if(!params.hasOwnProperty('pays'))
        params.pays = [];
      params.pays.push(parseInt($($(select).parent().next().children()[0]).val()));
    }

    if(criteria === 'genre') {
      if(!params.hasOwnProperty('genres'))
        params.genres = [];
      params.genres.push(parseInt($($(select).parent().next().children()[0]).val()));
    }

    if(criteria === 'realisateur') {
      let prenom = $($(select).parent().next().children().children()[0]).val();
      let nom = $($(select).parent().next().children().children()[1]).val();
      if(nom || prenom)
      {
        let realisateur = {};
        if(prenom)
          realisateur.prenom = prenom;

        if(nom)
          realisateur.nom = nom;

        if(!params.hasOwnProperty('realisateurs'))
          params.realisateurs = [];

        params.realisateurs.push(realisateur);
      }
    }

    if(criteria === 'acteur') {
      let prenom = $($(select).parent().next().children().children()[0]).val();
      let nom = $($(select).parent().next().children().children()[1]).val();
      if(nom || prenom)
      {
        let acteur = {};
        if(prenom)
          acteur.prenom = prenom;

        if(nom)
          acteur.nom = nom;

        if(!params.hasOwnProperty('acteurs'))
          params.acteurs = [];

        params.acteurs.push(acteur);
      }
    }
  });

  return params;
}

function addFilms(films)
{
  $(films).each(function(index, film){
    let anneeSortie = new Date(film.anneesortie);
    resultTable.row.add([
      film.idfilm,
      film.titre,
      ('0'+anneeSortie.getUTCDate()).slice(-2) + '-' + anneeSortie.getUTCMonth() + 1 + '-' + anneeSortie.getUTCFullYear(),
      film.duree,
      film.langue.nom
    ]).draw();
  });
}
$('#resultTable tbody').on('click', 'tr', function () {
  var data = resultTable.row( this ).data();

  var params = {
    idfilm: data[0],
    include: "genres,langues,collaborateurs"
  };

  $.ajax({
    method: 'GET',
    url: './films',
    data: params,
  })
    .done(function(films) {
      const film = films[0];
      const genres = [];
      const collabs = [];
      var firstClick = true;
      film.genres.forEach((genre, i) => {
        const space = i === 0 ? '' : ' ';
        genres.push(space + genre.nom);
      });
      $('#collabList').empty();

      sessionStorage.setItem('collaborateurs', JSON.stringify(film.collaborateurs));
      film.collaborateurs.forEach((c, i) => {
        $('#collabList').append($(`<a name='${c.idcollaborateur}' data-placement="bottom" data-toggle="popover" class="list-group-item"><strong>${c.filmcollaborateur.type}</strong> - ${c.prenom} ${c.nom}</a>`).click(popover));
      });

      $("[data-toggle=popover]").popover({
        html: true,
        trigger: 'click'
      });

      $("#filmImage").attr("src",film.poster);
      $("#modalTitle").text(film.titre);
      $("#filmResume").text(film.resumescenario || "Aucun résumé disponible.");
      $("#filmDuree").text(film.duree + ' min');
      $("#filmAnnee").text(film.anneesortie.substring(0, 4));
      $("#filmGenre").text(genres.toString());
      $("#filmLangue").text(film.langue.nom);
      $("#louerFilm").attr("value", film.idfilm);
      $('#myModal').modal('show');
    })
    .fail(function(err){
      console.log(err);
    })
    .always(function(){
    });
});

$('#louerFilm').click(event => {
  const idfilm = $('#louerFilm').attr('value');
  const idclient = sessionStorage.getItem('client') ? JSON.parse(sessionStorage.getItem('client')).idclient : null;

  if (idclient) {
    const params = {
      idclient,
      idfilm
    };
    $.ajax({
      method: 'POST',
      url: './locations',
      data: params,
    })
      .done(function(location) {
        $('#spanCopieId').text(`(#${location.nocode})`);
        validLocation.show();
      })
      .fail(function(err){
        failedLocation.show();
      });
  } else {
    invalidLocation.show();
  }
});

function popover() {
  $("[data-toggle=popover]").popover("destroy");

  const collabs = JSON.parse(sessionStorage.getItem('collaborateurs'));
  let collab = null;
  collabs.forEach( c => {
    if (c.idcollaborateur === parseInt($(this).attr('name'))) {
      collab = c;
    }
  });

  console.log(collab);
  console.log($(this));
  $("[data-toggle=popover]").popover({
    html: true,
    trigger: 'click',
    content: () => {
      return `
<div class="modal-body"> <div class="row">
<strong>${collab.prenom} ${collab.nom}</strong>
 </div>
<div class="row">
<img src="${collab.photo || ''}" />
 </div>
<hr>
<div class="row">
<label>Lieu naissance: </label>
<p>${collab.lieunaissance || 'Pas disponible'}</p>
 </div>
<div class="row">
<label>Date naissance: </label>
<p>${collab.datenaissance ? collab.datenaissance.substring(0,10) : 'Pas disponible'}</p>
 </div>
</div>
</div>`;
    }
  });
}
