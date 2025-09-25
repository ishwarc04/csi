        const ADMIN_CREDENTIALS = {
            id: "ishwarchatla",
            password: "csi@71"
        };

        function initializeStorage() {
            if (!localStorage.getItem('csiMembers')) {
                localStorage.setItem('csiMembers', JSON.stringify([]));
            }
        }

        function showLogin() {
            document.getElementById('loginPage').style.display = 'block';
            document.getElementById('registrationPage').style.display = 'none';
            document.getElementById('adminLoginPage').style.display = 'none';
            document.getElementById('adminPage').style.display = 'none';
        }
        
        function showRegistration() {
            document.getElementById('loginPage').style.display = 'none';
            document.getElementById('registrationPage').style.display = 'block';
            document.getElementById('adminLoginPage').style.display = 'none';
            document.getElementById('adminPage').style.display = 'none';
        }
        
        function showAdminLogin() {
            document.getElementById('loginPage').style.display = 'none';
            document.getElementById('registrationPage').style.display = 'none';
            document.getElementById('adminLoginPage').style.display = 'block';
            document.getElementById('adminPage').style.display = 'none';
        }
        
        function showAdminPage() {
            document.getElementById('loginPage').style.display = 'none';
            document.getElementById('registrationPage').style.display = 'none';
            document.getElementById('adminLoginPage').style.display = 'none';
            document.getElementById('adminPage').style.display = 'block';
            loadMembers();
        }
        
        function logout() {
            showLogin();
        }

        function loadMembers() {
            initializeStorage();
            const members = JSON.parse(localStorage.getItem('csiMembers'));
            const tableBody = document.getElementById('memberTableBody');
            tableBody.innerHTML = '';
            
            members.forEach((member, index) => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${member.name}</td>
                    <td>${member.email}</td>
                    <td>${member.prn}</td>
                    <td>${member.domain}</td>
                    <td>
                        <button class="action-btn delete-btn" onclick="deleteMember(${index})">Delete</button>
                    </td>
                `;
                tableBody.appendChild(row);
            });
        }
        
        function searchMembers() {
            const searchTerm = document.getElementById('searchMember').value.toLowerCase();
            const rows = document.getElementById('memberTableBody').getElementsByTagName('tr');
            
            for (let row of rows) {
                const name = row.cells[0].textContent.toLowerCase();
                const email = row.cells[1].textContent.toLowerCase();
                const prn = row.cells[2].textContent.toLowerCase();
                
                if (name.includes(searchTerm) || email.includes(searchTerm) || prn.includes(searchTerm)) {
                    row.style.display = '';
                } else {
                    row.style.display = 'none';
                }
            }
        }
        
        function deleteMember(index) {
            if (confirm('Are you sure you want to delete this member?')) {
                const members = JSON.parse(localStorage.getItem('csiMembers'));
                members.splice(index, 1);
                localStorage.setItem('csiMembers', JSON.stringify(members));
                loadMembers();
            }
        }
        
        function showAddMemberForm() {
            document.getElementById('addMemberForm').style.display = 'block';
        }
        
        function hideAddMemberForm() {
            document.getElementById('addMemberForm').style.display = 'none';
            document.getElementById('newMemberForm').reset();
        }

        document.getElementById('secretaryForm').addEventListener('submit', function(e) {
            e.preventDefault();
            
            const user = {
                name: document.getElementById('secretary-name').value,
                age: document.getElementById('secretary-age').value,
                gender: document.getElementById('secretary-gender').value,
                email: document.getElementById('secretary-email').value,
                phone: document.getElementById('secretary-phone').value,
                prn: document.getElementById('secretary-prn').value,
                domain: document.getElementById('secretary-domain').value,
                password: document.getElementById('secretary-password').value,
                role: 'Member',
                registeredAt: new Date().toISOString()
            };

            if (!user.email.endsWith('.edu')) {
                document.getElementById('registerError').textContent = 'Please use your institute email';
                return;
            }
            
            if (user.phone.length !== 10 || !/^\d+$/.test(user.phone)) {
                document.getElementById('registerError').textContent = 'Please enter a valid 10-digit mobile number';
                return;
            }
            
            
            initializeStorage();
            const members = JSON.parse(localStorage.getItem('csiMembers'));
            members.push(user);
            localStorage.setItem('csiMembers', JSON.stringify(members));
            
            
            sendConfirmationEmail(user);
            
            alert('Registration successful! Please login.');
            showLogin();
            this.reset();
        });
        
      
        document.getElementById('newMemberForm').addEventListener('submit', function(e) {
            e.preventDefault();
            
            const newMember = {
                name: document.getElementById('newMemberName').value,
                email: document.getElementById('newMemberEmail').value,
                prn: document.getElementById('newMemberPrn').value,
                domain: document.getElementById('newMemberDomain').value,
                password: document.getElementById('newMemberPassword').value,
                role: 'Member',
                registeredAt: new Date().toISOString()
            };
            
            
            initializeStorage();
            const members = JSON.parse(localStorage.getItem('csiMembers'));
            members.push(newMember);
            localStorage.setItem('csiMembers', JSON.stringify(members));
            
          
            loadMembers();
            hideAddMemberForm();
            this.reset();
            
            alert('Member added successfully!');
        });
        
       
        function sendConfirmationEmail(user) {
            const templateParams = {
                to_name: user.name,
                to_email: user.email,
                prn_number: user.prn,
                user_role: user.role,
                user_domain: user.domain,
                user_phone: user.phone
            };

            emailjs.send('service_b2d6rms', 'template_1rtyxwr', templateParams)
                .then(function(response) {
                    console.log('Email sent successfully!', response);
                }, function(error) {
                    console.error('Email failed to send:', error);
                });
        }
       
        document.getElementById('loginForm').addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;
            
           
            const members = JSON.parse(localStorage.getItem('csiMembers')) || [];
            const user = members.find(m => m.email === email && m.password === password);
            
            if (user) {
                
                window.location.href = 'index.html';
            } else {
                document.getElementById('loginError').textContent = 'Invalid email or password';
            }
        });
        
       
        document.getElementById('adminLoginForm').addEventListener('submit', function(e) {
            e.preventDefault();
            
            const username = document.getElementById('adminUsername').value;
            const password = document.getElementById('adminPassword').value;
            
            if (username === ADMIN_CREDENTIALS.id && password === ADMIN_CREDENTIALS.password) {
                showAdminPage();
            } else {
                document.getElementById('adminLoginError').textContent = 'Invalid admin credentials';
            }
        });
        
       
        window.onload = function() {
            initializeStorage();
            showLogin();
        };