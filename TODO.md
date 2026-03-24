# Debug and Fix Login/403 Issues - Progress Tracker

## Completed:
- [x] Created `backend/src/main/java/com/track2act/dto/response/UserDTO.java`
- [x] Fixed imports in MeController.java 
- [x] Removed duplicate inner UserDTO class from MeController.java 
- [x] Updated frontend AuthContext.jsx API paths: /auth/login → /api/auth/login, /auth/register → /api/auth/register

## Remaining:
- [ ] Add /api/logout endpoint (optional, frontend clears token)
- [ ] Read/verify JwtUtils.java for token generation
- [ ] Compile backend: cd backend && mvn clean compile
- [ ] Run backend server
- [ ] Test login flow: register user, login, check /api/me
- [ ] Fix any remaining 403 (e.g. other controllers)
