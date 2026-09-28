const KEY = "jrmovies_movies_v1";

const starterMovies = [
  {id:crypto.randomUUID(),title:"A Origem",originalTitle:"Inception",year:2010,releaseDate:"2010-07-16",director:"Christopher Nolan",country:"EUA / Reino Unido",genre:"Ficção científica",duration:148,classification:"14 anos",rating:8.8,posterUrl:"https://image.tmdb.org/t/p/w780/oYuLEt3zVCKq57qu2F8dT7NIa6f.jpg",trailerUrl:"",cast:"Leonardo DiCaprio, Joseph Gordon-Levitt, Elliot Page",synopsis:"Um especialista em invadir sonhos recebe a missão de implantar uma ideia na mente de um alvo. Para isso, ele reúne uma equipe e mergulha em camadas cada vez mais profundas de sonhos.",status:"Ativo",featured:true},
  {id:crypto.randomUUID(),title:"Interestelar",originalTitle:"Interstellar",year:2014,releaseDate:"2014-11-07",director:"Christopher Nolan",country:"EUA / Reino Unido",genre:"Ficção científica",duration:169,classification:"10 anos",rating:8.7,posterUrl:"https://image.tmdb.org/t/p/w780/rAiYTfKGqDCRIIqo664sY9XZIvQ.jpg",trailerUrl:"",cast:"Matthew McConaughey, Anne Hathaway, Jessica Chastain",synopsis:"Uma equipe de exploradores viaja através de um buraco de minhoca em busca de um novo lar para a humanidade.",status:"Ativo",featured:true},
  {id:crypto.randomUUID(),title:"O Poderoso Chefão",originalTitle:"The Godfather",year:1972,releaseDate:"1972-03-24",director:"Francis Ford Coppola",country:"EUA",genre:"Crime",duration:175,classification:"16 anos",rating:9.2,posterUrl:"https://image.tmdb.org/t/p/w780/3bhkrj58Vtu7enYsRolD1fZdja1.jpg",trailerUrl:"",cast:"Marlon Brando, Al Pacino, James Caan",synopsis:"A história de uma família que administra um poderoso império do crime organizado e de sua sucessão interna.",status:"Ativo",featured:false},
  {id:crypto.randomUUID(),title:"Matrix",originalTitle:"The Matrix",year:1999,releaseDate:"1999-03-31",director:"Lana Wachowski, Lilly Wachowski",country:"EUA",genre:"Ação",duration:136,classification:"14 anos",rating:8.7,posterUrl:"https://image.tmdb.org/t/p/w780/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg",trailerUrl:"",cast:"Keanu Reeves, Laurence Fishburne, Carrie-Anne Moss",synopsis:"Um programador descobre que a realidade em que vive é uma elaborada simulação e passa a lutar contra seus criadores.",status:"Ativo",featured:false},
  {id:crypto.randomUUID(),title:"Parasita",originalTitle:"Gisaengchung",year:2019,releaseDate:"2019-05-30",director:"Bong Joon Ho",country:"Coreia do Sul",genre:"Drama",duration:132,classification:"16 anos",rating:8.5,posterUrl:"https://image.tmdb.org/t/p/w780/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg",trailerUrl:"",cast:"Song Kang-ho, Lee Sun-kyun, Cho Yeo-jeong",synopsis:"Uma família de baixa renda encontra uma oportunidade inesperada ao se aproximar de uma família rica, desencadeando consequências imprevisíveis.",status:"Ativo",featured:false}
];

let movies = loadMovies();
let editingId = null;

const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];

function loadMovies(){
  try {
    const data = JSON.parse(localStorage.getItem(KEY));
    return Array.isArray(data) && data.length ? data : starterMovies;
  } catch { return starterMovies; }
}
function saveMovies(){ localStorage.setItem(KEY, JSON.stringify(movies)); }
function escapeHTML(v=""){
  return String(v).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]));
}
function toast(msg){
  const el=$("#toast"); el.textContent=msg; el.classList.add("show");
  setTimeout(()=>el.classList.remove("show"),2200);
}
function poster(url,title){
  return url ? `<img src="${escapeHTML(url)}" alt="Pôster de ${escapeHTML(title)}" onerror="this.parentElement.innerHTML='<div class=&quot;no-image&quot;>🎬</div>'">` : `<div class="no-image">🎬</div>`;
}
function populateFilters(){
  const genres=[...new Set(movies.map(m=>m.genre).filter(Boolean))].sort();
  const years=[...new Set(movies.map(m=>m.year).filter(Boolean))].sort((a,b)=>b-a);
  $("#genreFilter").innerHTML='<option value="">Todos os gêneros</option>'+genres.map(g=>`<option>${escapeHTML(g)}</option>`).join("");
  $("#yearFilter").innerHTML='<option value="">Todos os anos</option>'+years.map(y=>`<option>${y}</option>`).join("");
}
function filteredMovies(){
  const q=$("#searchInput").value.toLowerCase().trim(), genre=$("#genreFilter").value, year=$("#yearFilter").value;
  const minRating=Number($("#ratingFilter").value||0), sort=$("#sortFilter").value;
  let arr=movies.filter(m=>(!q || [m.title,m.originalTitle,m.director,m.cast,m.genre].join(" ").toLowerCase().includes(q))
    &&(!genre || m.genre===genre)&&(!year || String(m.year)===year)&&(Number(m.rating)>=minRating)&&(m.status!=="Inativo"));
  if(sort==="recent") arr.sort((a,b)=>b.year-a.year);
  if(sort==="old") arr.sort((a,b)=>a.year-b.year);
  if(sort==="rating") arr.sort((a,b)=>b.rating-a.rating);
  if(sort==="alpha") arr.sort((a,b)=>a.title.localeCompare(b.title));
  return arr;
}
function renderCatalog(){
  const arr=filteredMovies(), grid=$("#movieGrid");
  $("#resultsCount").textContent=`${arr.length} filme${arr.length===1?"":"s"}`;
  $("#emptyState").classList.toggle("hidden",arr.length>0);
  grid.innerHTML=arr.map(m=>`
    <article class="movie-card" data-id="${m.id}">
      <div class="poster">${poster(m.posterUrl,m.title)}${m.featured?'<span class="badge">DESTAQUE</span>':''}</div>
      <div class="movie-info">
        <div class="movie-title">${escapeHTML(m.title)}</div>
        <div class="meta"><span>${m.year} • ${escapeHTML(m.genre)}</span><span class="rating">★ ${Number(m.rating).toFixed(1)}</span></div>
      </div>
    </article>`).join("");
  $$("#movieGrid .movie-card").forEach(c=>c.onclick=()=>openDetail(c.dataset.id));
}
function renderHero(){
  const m=movies.find(x=>x.featured && x.status!=="Inativo") || movies[0];
  if(!m){$("#heroMovie").innerHTML="";return}
  $("#heroMovie").innerHTML=`${poster(m.posterUrl,m.title)}<div class="overlay"><span class="eyebrow">EM DESTAQUE</span><h2>${escapeHTML(m.title)}</h2><div class="meta"><span>${m.year} • ${escapeHTML(m.genre)}</span><span class="rating">★ ${Number(m.rating).toFixed(1)}</span></div></div>`;
}
function renderStats(){
  $("#statTotal").textContent=movies.length;
  $("#statFeatured").textContent=movies.filter(m=>m.featured).length;
  $("#statAverage").textContent=movies.length?(movies.reduce((a,m)=>a+Number(m.rating||0),0)/movies.length).toFixed(1):"0.0";
  $("#statGenres").textContent=new Set(movies.map(m=>m.genre).filter(Boolean)).size;
}
function renderAdmin(){
  $("#adminTable").innerHTML=movies.slice().sort((a,b)=>b.year-a.year).map(m=>`
    <tr>
      <td><strong>${escapeHTML(m.title)}</strong></td><td>${m.year}</td><td>${escapeHTML(m.genre)}</td>
      <td class="rating">★ ${Number(m.rating).toFixed(1)}</td><td class="status">${escapeHTML(m.status)}</td>
      <td><div class="actions"><button class="btn btn-ghost mini" data-edit="${m.id}">Editar</button><button class="btn btn-ghost mini" data-delete="${m.id}">Excluir</button></div></td>
    </tr>`).join("");
  $$("[data-edit]").forEach(b=>b.onclick=()=>openForm(b.dataset.edit));
  $$("[data-delete]").forEach(b=>b.onclick=()=>deleteMovie(b.dataset.delete));
}
function refresh(){saveMovies();populateFilters();renderCatalog();renderHero();renderStats();renderAdmin();}
function openDetail(id){
  const m=movies.find(x=>x.id===id); if(!m)return;
  $("#modalBody").innerHTML=`<div class="detail">
    <div class="detail-poster">${poster(m.posterUrl,m.title)}</div>
    <div class="detail-content">
      <span class="eyebrow">${m.featured?"DESTAQUE":"FILME"}</span>
      <h2>${escapeHTML(m.title)}</h2>
      <div class="meta"><span>${m.year} • ${escapeHTML(m.genre)} • ${m.duration||"—"} min</span><span class="rating">★ ${Number(m.rating).toFixed(1)}</span></div>
      <div class="chips">${[m.classification,m.director,m.country].filter(Boolean).map(x=>`<span class="chip">${escapeHTML(x)}</span>`).join("")}</div>
      <p>${escapeHTML(m.synopsis||"Sem sinopse cadastrada.")}</p>
      <p><strong>Elenco:</strong> ${escapeHTML(m.cast||"Não informado")}</p>
      ${m.trailerUrl?`<a class="btn btn-primary" target="_blank" rel="noopener" href="${escapeHTML(m.trailerUrl)}">▶ Assistir trailer</a>`:""}
    </div></div>`;
  $("#movieModal").classList.remove("hidden");
}
function resetForm(){
  $("#movieForm").reset(); $("#movieId").value=""; $("#rating").value=8; $("#formTitle").textContent="Cadastrar filme"; editingId=null;
}
function openForm(id=null){
  resetForm();
  if(id){
    const m=movies.find(x=>x.id===id); if(!m)return;
    editingId=id; $("#formTitle").textContent="Editar filme";
    const map={title:"title",originalTitle:"originalTitle",year:"year",releaseDate:"releaseDate",director:"director",country:"country",genre:"genre",duration:"duration",classification:"classification",rating:"rating",posterUrl:"posterUrl",trailerUrl:"trailerUrl",cast:"cast",synopsis:"synopsis",status:"status"};
    Object.entries(map).forEach(([k,id2])=>{$("#"+id2).value=m[k]??""});
    $("#featured").checked=!!m.featured; $("#movieId").value=id;
  }
  $("#formModal").classList.remove("hidden");
}
function closeModals(){$$(".modal").forEach(x=>x.classList.add("hidden"))}
function deleteMovie(id){
  const m=movies.find(x=>x.id===id);
  if(m && confirm(`Excluir "${m.title}"? Esta ação não pode ser desfeita.`)){
    movies=movies.filter(x=>x.id!==id); refresh(); toast("Filme excluído com sucesso.");
  }
}
$("#movieForm").addEventListener("submit",e=>{
  e.preventDefault();
  const data={id:editingId||crypto.randomUUID(),title:$("#title").value.trim(),originalTitle:$("#originalTitle").value.trim(),year:Number($("#year").value),releaseDate:$("#releaseDate").value,director:$("#director").value.trim(),country:$("#country").value.trim(),genre:$("#genre").value.trim(),duration:Number($("#duration").value)||null,classification:$("#classification").value.trim(),rating:Number($("#rating").value)||0,posterUrl:$("#posterUrl").value.trim(),trailerUrl:$("#trailerUrl").value.trim(),cast:$("#cast").value.trim(),synopsis:$("#synopsis").value.trim(),status:$("#status").value,featured:$("#featured").checked};
  if(editingId) movies=movies.map(m=>m.id===editingId?data:m); else movies.unshift(data);
  refresh(); closeModals(); toast(editingId?"Filme atualizado!":"Filme cadastrado!");
});
["searchInput","genreFilter","yearFilter","ratingFilter","sortFilter"].forEach(id=>$("#"+id).addEventListener("input",renderCatalog));
["newMovieTop","newMovieAdmin","heroAdd"].forEach(id=>$("#"+id).onclick=()=>openForm());
$$("[data-close]").forEach(b=>b.onclick=closeModals);
$$(".modal").forEach(m=>m.addEventListener("click",e=>{if(e.target===m)closeModals()}));
refresh();
