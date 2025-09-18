document.addEventListener('DOMContentLoaded', () => {
    // All your existing main.js code goes here
    fetch('assets/score/bxb-template.json')
        .then(res => res.json())
        .then(data => initParticipants(data))
        .catch(err => console.error('Failed to load data:', err));

    function initParticipants(data) {
      const tableBody = document.querySelector('#scoreTable tbody');

      data.forEach(player => {
          const row = document.createElement('tr');

          // Name cell
          const nameCell = document.createElement('td');
          const nameButton = document.createElement('button');
          nameButton.textContent = player["Participant Name"];
          nameButton.classList.add('btn', 'btn-link', 'p-0', 'name-btn');
          nameButton.addEventListener('click', () => {
            showPlayerModal(player);
            nameButton.classList.add('name-clicked');
            setTimeout(() => {
            nameButton.classList.remove('name-clicked');
            }, 300);
        });
          nameCell.appendChild(nameButton);
          row.appendChild(nameCell);

          // Score cell with progress bar
          const scoreCell = document.createElement('td');

          const progressDiv = document.createElement('div');
          progressDiv.classList.add('progress');

          const progressBar = document.createElement('div');
          progressBar.classList.add('progress-bar');
          progressBar.setAttribute('role', 'progressbar');

          const totalScore = player.Total || 0; // fallback to 0 if undefined
          const percent = Math.min(Math.max(totalScore, 0), 100); // ensure 0-100

          progressBar.style.width = percent + '%';
          progressBar.setAttribute('aria-valuenow', percent);
          progressBar.setAttribute('aria-valuemin', '0');
          progressBar.setAttribute('aria-valuemax', '100');
          progressBar.textContent = totalScore;

          progressDiv.appendChild(progressBar);
          scoreCell.appendChild(progressDiv);
          row.appendChild(scoreCell);

          tableBody.appendChild(row);
      });
  }

    function showPlayerModal(player) {
      const modalTitle = document.getElementById('playerModalLabel');
      const modalBody = document.getElementById('playerModalBody');

      modalTitle.textContent = player["Participant Name"];
      modalBody.innerHTML = '';

      // Main accordion for weeks
      const weekAccordion = document.createElement('div');
      weekAccordion.classList.add('accordion');
      weekAccordion.id = 'weekAccordion';

      for (let week = 1; week <= 4; week++) {
          const weekItem = document.createElement('div');
          weekItem.classList.add('accordion-item');

          // Week header
          const weekHeader = document.createElement('h2');
          weekHeader.classList.add('accordion-header');
          weekHeader.id = `headingWeek${week}`;

          const weekButton = document.createElement('button');
          weekButton.classList.add('accordion-button', 'collapsed');
          weekButton.setAttribute('type', 'button');
          weekButton.setAttribute('data-bs-toggle', 'collapse');
          weekButton.setAttribute('data-bs-target', `#collapseWeek${week}`);
          weekButton.setAttribute('aria-expanded', 'false');
          weekButton.setAttribute('aria-controls', `collapseWeek${week}`);
          weekButton.textContent = `Week ${week}`;

          weekHeader.appendChild(weekButton);
          weekItem.appendChild(weekHeader);

          // Week collapse
          const weekCollapse = document.createElement('div');
          weekCollapse.id = `collapseWeek${week}`;
          weekCollapse.classList.add('accordion-collapse', 'collapse');
          weekCollapse.setAttribute('aria-labelledby', `headingWeek${week}`);
          weekCollapse.setAttribute('data-bs-parent', '#weekAccordion');

          const weekBody = document.createElement('div');
          weekBody.classList.add('accordion-body');

          // Inner accordion for places
          const placeAccordion = document.createElement('div');
          placeAccordion.classList.add('accordion');
          placeAccordion.id = `placeAccordionWeek${week}`;

          ['Bhub', 'Batuu'].forEach(place => {
              const placeItem = document.createElement('div');
              placeItem.classList.add('accordion-item');

              const placeHeader = document.createElement('h2');
              placeHeader.classList.add('accordion-header');
              placeHeader.id = `heading${week}${place}`;

              const placeButton = document.createElement('button');
              placeButton.classList.add('accordion-button', 'collapsed');
              placeButton.setAttribute('type', 'button');
              placeButton.setAttribute('data-bs-toggle', 'collapse');
              placeButton.setAttribute('data-bs-target', `#collapse${week}${place}`);
              placeButton.setAttribute('aria-expanded', 'false');
              placeButton.setAttribute('aria-controls', `collapse${week}${place}`);
              placeButton.textContent = place;

              placeHeader.appendChild(placeButton);
              placeItem.appendChild(placeHeader);

              const placeCollapse = document.createElement('div');
              placeCollapse.id = `collapse${week}${place}`;
              placeCollapse.classList.add('accordion-collapse', 'collapse');
              placeCollapse.setAttribute('aria-labelledby', `heading${week}${place}`);
              placeCollapse.setAttribute('data-bs-parent', `#placeAccordionWeek${week}`);

              // Routes as compact colored blocks
              const routesContainer = document.createElement('div');
              routesContainer.style.display = 'flex';
              routesContainer.style.flexWrap = 'wrap';
              routesContainer.style.justifyContent = 'center';
              routesContainer.style.gap = '4px';
              routesContainer.style.marginTop = '4px';

              for (let r = 1; r <= 25; r++) {
                  const key = `Week${week}.${place}.R${r}`;
                  if (player[key] !== undefined) {
                      const routeBlock = document.createElement('div');
                      routeBlock.style.width = '42px';
                      routeBlock.style.height = '42px';
                      routeBlock.style.borderRadius = '4px';
                      routeBlock.style.display = 'flex';
                      routeBlock.style.alignItems = 'center';
                      routeBlock.style.justifyContent = 'center';
                      routeBlock.style.fontSize = '12px';
                      routeBlock.style.color = 'white';
                      routeBlock.style.fontWeight = 'bold';
                      routeBlock.textContent = `R${r}`;
                      routeBlock.style.backgroundColor = player[key] === "1" ? 'green' : '#F5146E';

                      routesContainer.appendChild(routeBlock);
                  }
              }

              placeCollapse.appendChild(routesContainer);
              placeItem.appendChild(placeCollapse);
              placeAccordion.appendChild(placeItem);
          });

          weekBody.appendChild(placeAccordion);
          weekCollapse.appendChild(weekBody);
          weekItem.appendChild(weekCollapse);
          weekAccordion.appendChild(weekItem);
      }

      modalBody.appendChild(weekAccordion);

      const playerModal = new bootstrap.Modal(document.getElementById('playerModal'));
      playerModal.show();
  }
});
