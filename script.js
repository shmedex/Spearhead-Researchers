 const apiKey = 'd0ut769r01qmg3uisj7gd0ut769r01qmg3uisj80';
        const symbols = ['AAPL', 'USD', 'DOW', 'AMZN',];

        // Format numbers with commas
        function formatNumber(num) {
            return num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        }

        // Calculate percentage change
        function calculateChange(current, previous) {
            if (previous === 0) return 0;
            return ((current - previous) / previous) * 100;
        }

        // Get color class based on value
        function getChangeClass(change) {
            if (change > 0) return 'price-up';
            if (change < 0) return 'price-down';
            return 'price-neutral';
        }

        // Get arrow icon based on value
        function getChangeIcon(change) {
            if (change > 0) return 'bi-arrow-up';
            if (change < 0) return 'bi-arrow-down';
            return 'bi-dash';
        }

        async function fetchStockCards() {
            const container = document.getElementById('stockCards');

            try {
                // Show loading state
                container.innerHTML = `
                    <div class="col-12 text-center py-5">
                        <div class="spinner-border text-primary" role="status">
                            <span class="visually-hidden">Loading...</span>
                        </div>
                        <p class="mt-2">Loading market data...</p>
                    </div>
                `;

                // Fetch all stock data first
                const stockData = {};
                for (let symbol of symbols) {
                    const response = await fetch(`https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${apiKey}`);
                    const data = await response.json();
                    stockData[symbol] = data;
                }

                // Now build the cards
                let cardsHTML = '';
                for (let symbol of symbols) {
                    const data = stockData[symbol];
                    if (!data || !data.c) continue;

                    const change = calculateChange(data.c, data.pc);
                    const changeClass = getChangeClass(change);
                    const changeIcon = getChangeIcon(change);
                    const changeValue = (data.c - data.pc).toFixed(2);

                    cardsHTML += `
                        <div class="col-md-6 col-lg-3 mb-4">
                            <div class="card stock-card h-100">
                                <div class="card-header d-flex justify-content-between align-items-center">
                                    <span class="font-weight-bold">${symbol}</span>
                                    <span class="badge bg-light text-dark"></span>
                                </div>
                                <div class="card-body">
                                    <div class="d-flex justify-content-between align-items-center mb-2">
                                        <h3 class="mb-0 font-weight-bold">$${formatNumber(data.c)}</h3>
                                    </div>
                                    <div class="d-flex justify-content-between align-items-center">
                                        <small class="text-muted">Prev Close: $${formatNumber(data.pc)}</small>
                                        <span class="${changeClass}">
                                            <i class="bi ${changeIcon}"></i> ${Math.abs(change).toFixed(2)}% (${changeValue})
                                        </span>
                                    </div>
                                    <!--
                                    <div class="mt-3">
                                        <small class="d-block text-muted">
                                            <span class="font-weight-bold">High:</span> $${formatNumber(data.h)}
                                        </small>
                                        <small class="d-block text-muted">
                                            <span class="font-weight-bold">Low:</span> $${formatNumber(data.l)}
                                        </small>
                                    </div>-->
                                </div>
                                <!--<div class="card-footer bg-transparent border-top-0">
                                    <a href="#" class="btn btn-sm btn-outline-primary w-100">View Details</a>
                                </div>-->
                            </div>
                        </div>
                    `;
                }

                container.innerHTML = cardsHTML;

            } catch (err) {
                console.error('Error fetching stock data:', err);
                container.innerHTML = `
                    <div class="col-12 text-center py-5">
                        <i class="bi bi-exclamation-triangle fs-1 text-danger"></i>
                        <h4 class="mt-3">Failed to load market data</h4>
                        <p>Please try again later or contact support if the problem persists.</p>
                        <button class="btn btn-primary mt-2" onclick="fetchStockCards()">Retry</button>
                    </div>
                `;
            }
        }

        // Initial fetch
        fetchStockCards();

        // Refresh every 5 minutes
        setInterval(fetchStockCards, 300000);

        // Smooth scrolling for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                document.querySelector(this.getAttribute('href')).scrollIntoView({
                    behavior: 'smooth'
                });
            });
        });

         // Password strength indicator
        document.getElementById('password').addEventListener('input', function () {
            const password = this.value;
            const strengthBar = document.getElementById('passwordStrength');
            let strength = 0;

            if (password.length >= 8) strength += 1;
            if (password.match(/[a-z]/)) strength += 1;
            if (password.match(/[A-Z]/)) strength += 1;
            if (password.match(/[0-9]/)) strength += 1;
            if (password.match(/[^a-zA-Z0-9]/)) strength += 1;

            const width = (strength / 5) * 100;
            strengthBar.style.width = width + '%';

            if (strength <= 2) {
                strengthBar.style.backgroundColor = 'var(--accent-color)';
            } else if (strength <= 4) {
                strengthBar.style.backgroundColor = '#f39c12';
            } else {
                strengthBar.style.backgroundColor = '#27ae60';
            }
        });