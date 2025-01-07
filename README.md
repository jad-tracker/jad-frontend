# Jad Frontend

# Jad Backend

## Instructiuni pentru pull request

### Initializare repo
1. Deschide un terminal in folderul unde vei salva cele doua repo-uri
2. Executa `git clone https://github.com/jad-tracker/jad-frontend`
3. Executa `npm install`

### Rezolvarea unui task
1. Pe GitHub creeaza un nou branch remote cu nume sugestiv pt task-ul pe care il rezolvi
2. Deschide un terminal din IDE-ul folosit (verifica calea curenta sa fie folderul proiectului de frontend)
3. Executa `git remote update --prune origin`
4. Executa `git checkout nume_branch_remote`, unde `nume_branch_remote` e numele folosit la pasul 1
5. Acum poti scrie cod pentru a rezolva task-ul
6. Neaparat testele relevante pentru task trebuie activate, iar toate testele active trebuie sa treaca cu succes
7. Adauga modificarile din IDE (sau cu `git add`) si dupa fa commit din IDE (sau cu `git commit -m "mesaj de commit"`).
   Foloseste un mesaj de commit relevant
8. Executa `git push -u origin nume_branch_remote`, unde `nume_branch_remote` e numele folosit la pasul 1
9. Creeaza un pull request pe github din branch-ul nou pe main. Refera numarul issue-ului in corpul PR-ului sau in titlu.
10. Cere code review

## Instructiuni de rulare

### Rulare proiect

IMPORTANT: Ruleaza prima data backend-ul (vezi instructiunile de rulare din backend)

1. Descide un terminal din IDE-ul folosit (verifica calea curenta sa fie folderul proiectului de frontend)
2. Executa `npm run dev`