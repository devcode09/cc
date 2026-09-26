/* ============================================================
   CAMPUS CUPID — MATCHING ALGORITHM (C LOGIC)
   C Programming Project Component
   Demonstrates: structures, arrays, strings, functions,
   conditionals, loops, searching, sorting, basic matching logic.
   ============================================================ */

#include <stdio.h>
#include <string.h>

#define MAX_STUDENTS 10
#define MAX_INTERESTS 10

struct Student {
    char id[10];
    char name[50];
    char branch[30];
    char campus[20];
    int year;
    char interests[MAX_INTERESTS][30];
    int interestCount;
    int lookingForStudyBuddy; /* 1 = yes, 0 = no */
    int lookingForFriendship;
    int lookingForDating;
};

struct MatchResult {
    char name[50];
    int score;
};

/* ---------- Function Prototypes ---------- */
int countCommonInterests(struct Student a, struct Student b);
int calculateYearScore(struct Student a, struct Student b);
int calculateBranchScore(struct Student a, struct Student b);
int calculateModeScore(struct Student a, struct Student b);
int calculateCompatibility(struct Student a, struct Student b);
void sortMatchesDescending(struct MatchResult results[], int n);
int searchStudentByName(struct Student list[], int n, char name[]);
void printStudent(struct Student s);

/* ---------- Interest Overlap ---------- */
int countCommonInterests(struct Student a, struct Student b){
    int count = 0;
    for(int i = 0; i < a.interestCount; i++){
        for(int j = 0; j < b.interestCount; j++){
            if(strcmp(a.interests[i], b.interests[j]) == 0){
                count++;
                break;
            }
        }
    }
    return count;
}

/* ---------- Year Proximity Score ---------- */
int calculateYearScore(struct Student a, struct Student b){
    int diff = a.year - b.year;
    if(diff < 0) diff = -diff;   /* absolute value */

    if(diff == 0) return 20;      /* same year -> strongest */
    else if(diff == 1) return 10; /* adjacent year -> flexible mode */
    else return 0;                 /* far year -> only in "all campus" mode */
}

/* ---------- Branch Score ---------- */
int calculateBranchScore(struct Student a, struct Student b){
    if(strcmp(a.branch, b.branch) == 0) return 10;
    return 0;
}

/* ---------- Looking-For / Mode Score ---------- */
int calculateModeScore(struct Student a, struct Student b){
    int score = 0;
    if(a.lookingForDating && b.lookingForDating) score += 20;
    if(a.lookingForFriendship && b.lookingForFriendship) score += 15;
    if(a.lookingForStudyBuddy && b.lookingForStudyBuddy) score += 15;
    return score > 20 ? 20 : score; /* cap contribution */
}

/* ---------- Master Compatibility Function ---------- */
int calculateCompatibility(struct Student a, struct Student b){
    int interestScore   = countCommonInterests(a, b) * 10; /* up to 40 for 4+ shared */
    if(interestScore > 40) interestScore = 40;

    int yearScore    = calculateYearScore(a, b);
    int branchScore  = calculateBranchScore(a, b);
    int modeScore    = calculateModeScore(a, b);

    int compatibility = interestScore + yearScore + branchScore + modeScore;

    if(compatibility > 98) compatibility = 98; /* never show as "perfect/guaranteed" */
    return compatibility;
}

/* ---------- Bubble Sort (Descending by score) ---------- */
void sortMatchesDescending(struct MatchResult results[], int n){
    for(int i = 0; i < n - 1; i++){
        for(int j = 0; j < n - i - 1; j++){
            if(results[j].score < results[j+1].score){
                struct MatchResult temp = results[j];
                results[j] = results[j+1];
                results[j+1] = temp;
            }
        }
    }
}

/* ---------- Linear Search by Name ---------- */
int searchStudentByName(struct Student list[], int n, char name[]){
    for(int i = 0; i < n; i++){
        if(strcmp(list[i].name, name) == 0) return i;
    }
    return -1; /* not found */
}

void printStudent(struct Student s){
    printf("%-6s %-18s Y%d  %-12s %-8s\n", s.id, s.name, s.year, s.branch, s.campus);
}

/* ============================================================
   MAIN — Demonstration Driver
   ============================================================ */
int main(){
    struct Student students[MAX_STUDENTS] = {
        {"S001","Aarav Mehta","CSE","Bidholi",2,{"Coding","Gym","Music","Startups"},4,1,1,0},
        {"S002","Kabir Singh","CSE","Bidholi",3,{"Cricket","Coding","Gaming","AI"},4,1,0,0},
        {"S003","Meher Kapoor","CSE","Kandoli",2,{"Coding","Anime","Writing","Music"},4,1,1,0},
        {"S004","Ananya Verma","Marketing","Kandoli",1,{"Dance","Fashion","Netflix","Food"},4,0,1,1},
        {"S005","Rohan Malhotra","Mechanical","Bidholi",2,{"Football","Gym","Movies","Travel"},4,1,1,0}
    };
    int n = 5;

    /* Student we want matches for: Aarav (index 0) */
    struct Student me = students[0];

    printf("=== CAMPUS CUPID — C MATCHING ENGINE ===\n\n");
    printf("Finding matches for: %s (Year %d, %s)\n\n", me.name, me.year, me.branch);

    struct MatchResult results[MAX_STUDENTS];
    int resultCount = 0;

    for(int i = 0; i < n; i++){
        if(strcmp(students[i].id, me.id) == 0) continue; /* skip self */
        int score = calculateCompatibility(me, students[i]);
        strcpy(results[resultCount].name, students[i].name);
        results[resultCount].score = score;
        resultCount++;
    }

    sortMatchesDescending(results, resultCount);

    printf("Ranked Matches:\n");
    printf("----------------------------------\n");
    for(int i = 0; i < resultCount; i++){
        printf("%d. %-18s %d%% Compatible\n", i+1, results[i].name, results[i].score);
    }

    /* Demonstrate search feature */
    printf("\nSearching for student 'Meher Kapoor'...\n");
    int idx = searchStudentByName(students, n, "Meher Kapoor");
    if(idx != -1){
        printf("Found: ");
        printStudent(students[idx]);
    } else {
        printf("Student not found.\n");
    }

    return 0;
}

