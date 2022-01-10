#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <time.h>
#include <ncurses.h>
#include <locale.h>

/*
 * todo list
 * maybe timer ?
*/


int ROWS,
	COLS;

MEVENT event;
struct button{
	int x;
	int y;
	int w;
	int h;
	char * text;
	int hovered;
	int clicked;
};

struct button createButton(int x, int y, char* text) {
	struct button b;
	b.x = x;
	b.y = y;
	b.w = strlen(text);
	b.h = 1;
	b.text = text;
	b.hovered = 0;
	b.clicked = 1;
	return b;
}

int * createArray(int n) {
	return calloc(sizeof(int), n);
}

void printArray(int * p, int n, int m) {
	for (int i = 0; i < n; i++) {
		for (int j = 0; j < m; j++) {
			printf("%d ", p[j+i*m]);
		}
		printf("\n");
	}
}

void showBoard(int * p, int n, int m) {
	printf("   ");
	for (int j = 0; j < m; j++) 
		printf("%c ", j+'A');
	printf("\n");
	for (int i = 0; i < n; i++) {
		printf("%d ", i+1);
		if (i+1<10)
			printf(" ");
		for (int j = 0; j < m; j++) {
			if (p[j+i*m] == 0) {
				printf("* ");
			} else if (p[j+i*m] == 9) {
				printf("  ");
			} else {
				printf("%c ", p[j+i*m]+'0');
			}
			//printf("%c ", (p[j+i*m])?p[j+i*m]+'0':'*');
		}
		printf("\n");
	}
}

void fillMines(int * m, int n, int n_mines) {
	int r;
	for (int i = 0; i < n_mines; i++) {
		do {
			r = rand()%n;
		}while (m[r]);
		m[r] = 1;
	}
}

void fillNeighbors(int * p, int * mines, int n, int m) {
	int c;
	for (int i = 0; i < n; i++) {
		for (int j = 0; j < m; j++) {
			c = 0;
			if (mines[j+i*m]) {
				p[j+i*m] = 9; 
			} else {
				for (int a = -1; a < 2; a++) {
					for (int b = -1; b < 2; b++) {
						if (i + a >= 0 && i + a < n && j + b >= 0 && j + b < m) {
							if (mines[(j+b)+(i+a)*m])
								c++;
						}	
					}
				}
				p[j+i*m] = c;
			}
		}
	}
}

int uncover(int * mines, int * neighbors, int * board, int n, int m, int i, int j) {
	if (mines[j+i*m]) {
		board[j+i*m] = -1;
		return 0;
	}else if (neighbors[j+i*m]) {
		board[j+i*m] = neighbors[j+i*m];
		return 1;
	}else if (!board[j+i*m]) {
		board[j+i*m] = 9;
		for (int a = -1; a < 2; a++) {
			for (int b = -1; b < 2; b++) {
				if (i + a >= 0 && i + a < n && j + b >= 0 && j + b < m && !(a == 0 && b == 0)) {
					uncover(mines, neighbors, board, n, m, i+a, j+b);
				}	
			}
		}
	}
	return 1;
}

int show(int * mines, int * neighbors, int * board, int n, int m, int i, int j, int flag) {
	// 0 mines
	// 1 mines
	if (flag) {
		if (board[j+i*m] == 0){
			board[j+i*m] = -2;
			return 1;
		}else if (board[j+i*m] == -2) {
			board[j+i*m] = 0;
			return -1;
		}else{
			return 0;
		}
	}else{
		return uncover(mines, neighbors, board, n, m, i, j);
	}
}

int countSpaces(int * board, int n) {
	int c = 0;
	for (int i = 0; i < n; i++)
		if (board[i] == 0 || board[i] == -2)
			c++;

	return c;
}

void drawBoard(int * board, int n, int m, int xoffset, int yoffset, int row, int col) {
	for (int i = 0; i < n; i++) {
		for (int j = 0; j < m; j++) {
			if (i == row && j == col && board[j+i*m] == 0)
				attron(A_REVERSE);
			else
				attroff(A_REVERSE);

			move(yoffset+i, xoffset+j*2);
			if (board[j+i*m] == 0) {
				addch('~');
			}else if (board[j+i*m] == -1) {
				//addstr("⊗");
				addstr("💣"); 
			}else if (board[j+i*m] == -2) {
				addstr("⚑");
			}else if (board[j+i*m] != 9) {
				attrset(COLOR_PAIR(board[j+i*m]+1));
				addch(board[j+i*m] + '0');
				attrset(COLOR_PAIR(0));
			}else{
				addch(' ');
			}
		}
	}
}

void addText(struct button b) {
	if (b.hovered) 
		attrset(A_BOLD | COLOR_PAIR(1));
	mvaddstr(b.y, b.x, b.text);
	attrset(A_NORMAL | COLOR_PAIR(0));
}

void end(int * board, int n, int m, int won, int xoffset, int yoffset) {
	struct button back = createButton(xoffset + m * 2 - 5, yoffset + n + 1, "BACK");
	int quit = 0,
		c = -1;
	while (!quit) {
		if (c == KEY_MOUSE) {
			if (getmouse(&event) == OK){
				if (event.x >= back.x && event.x < back.x + back.w && event.y >= back.y && event.y < back.y + back.h) {
					back.hovered = 1;
					if (event.bstate == 2)
						quit = 1;
				}
			}
		}
		//clear();
		drawBoard(board, n, m, xoffset, yoffset, -1, -1);
		addText(back);

		if (won != 2)
			mvaddstr(yoffset+n+1, xoffset, "YOU WIN");
		else
			mvaddstr(yoffset+n+1, xoffset, "YOU LOSE");

		refresh();
		if (c==27)
			quit=1;
		c = wgetch(stdscr);
		if (c==10) {
			quit=1;
		}
	}
}

void resize(int n, int m, int * xoffset, int * yoffset, int centered) {
	getmaxyx(stdscr, ROWS, COLS);
	if (centered) {
		*xoffset = COLS / 2;
		*yoffset = ROWS / 2;
	} else {
		*xoffset = (COLS - m*2) / 2;
		*yoffset = (ROWS - n) / 2;
	}
	clear();
}

int countNeighbors(int * board, int n, int m, int i, int j) {
	int c = 0;
	int f = 0;
	for (int a = -1; a < 2; a++) {
		for (int b = -1; b < 2; b++) {
			if (i + a >= 0 && i + a < n && j + b >= 0 && j + b < m) {
				if (board[j+b+(i+a)*m] == 0) {
					c++;
				}else if (board[j+b+(i+a)*m] == -2) {
					f++;
				}
			}	
		}
	}
	if (board[j+i*m] == f)
		return -1;
	else
		return c+f;
}

int ai(int * board, int n, int m, int * I, int * J, int * flag) {
	float max = 10.0f;
	int maxx = 0;
	int maxy =0;
	int count;
	float max2 = 10.0f;
	float p;
	
	*I = rand()%n;
	*J = rand()%m;
	
	float * prob = calloc(sizeof(float), n*m);

	for (int i = 0; i < n; i++) {
		for (int j = 0; j < m; j++) {
			if (board[j+i*m] == 0) {
				max2 = 10.0f;
				for (int a = -1; a < 2; a++) {
					for (int b = -1; b < 2; b++) {
						if (i + a >= 0 && i + a < n && j + b >= 0 && j + b < m) {
							if (board[j+b+(i+a)*m] > 0 && board[j+b+(i+a)*m] < 9) {
								count = countNeighbors(board, n, m, i+a, j+b);
								if (count == -1) {
									*I = i;
									*J = j;
									*flag = 0;
									return 0;
								}else if (count == board[j+b+(i+a)*m]) {
									*I = i;
									*J = j;
									*flag = 1;
									return 0;
								}else{
									p = (float)board[j+b+(i+a)*m] / (float)count; 
									prob[j+i*m] += p;
									if (p < max2)
										max2 = p;
								}
							}
						}	
					}
				}
				/*
				if (max2 < max){
					maxx = i;
					maxy = j;
					max = max2;
				}
				*/
				if (prob[j+i*m] < max && prob[j+i*m] != 0) {
					maxx = i;
					maxy = j;
					max = prob[j+i*m];
				}
			}
		}
	}
	*I = maxx;
	*J = maxy;
	*flag = 0;
	return 0;
}

void initNcurse(int* ROW, int* COL){
	setlocale(LC_ALL, "");
	initscr();
	raw();
	//noecho();
	curs_set(0);

	int x,y;

	getmaxyx(stdscr, x, y);

	*ROW = x;
	*COL = y;

	// Enables keypad mode. This makes (at least for me) mouse events getting
	// reported as KEY_MOUSE, instead as of random letters.
	keypad(stdscr, TRUE);

	// Don't mask any mouse events
	mousemask(ALL_MOUSE_EVENTS | REPORT_MOUSE_POSITION, NULL);
	mouseinterval(0);

	// colors
	use_default_colors();
	start_color();
	init_color(0, 0, 0, 0);
	init_color(1, 242*3.9f, 242*3.9f, 242*3.9f);
	init_color(2, 174*3.9f, 245*3.9f, 152*3.9f);
	init_color(3, 200*3.9f, 227*3.9f, 120*3.9f);
	init_color(4, 223*3.9f, 208*3.9f,  98*3.9f);
	init_color(5, 242*3.9f, 187*3.9f,  89*3.9f);
	init_color(6, 255*3.9f, 164*3.9f,  92*3.9f);
	init_color(7, 255*3.9f, 141*3.9f, 105*3.9f);
	init_color(8, 255*3.9f, 121*3.9f, 125*3.9f);
	init_color(9, 253*3.9f, 105*3.9f, 148*3.9f);
	init_pair(0, 1, 0);
	init_pair(1, 0, 1);
	init_pair(2, 2, -1);
	init_pair(3, 3, -1);
	init_pair(4, 4, -1);
	init_pair(5, 5, -1);
	init_pair(6, 6, -1);
	init_pair(7, 7, -1);
	init_pair(8, 8, -1);
	init_pair(9, 9, -1);
}

void drawTitle(int x, int y) {
	// 90 chars long
	if (x >= 45) {
		mvaddstr(y-7, x-45, "███╗   ███╗██╗███╗   ██╗███████╗███████╗██╗    ██╗███████╗███████╗██████╗ ███████╗██████╗ ");
		mvaddstr(y-6, x-45, "████╗ ████║██║████╗  ██║██╔════╝██╔════╝██║    ██║██╔════╝██╔════╝██╔══██╗██╔════╝██╔══██╗");
		mvaddstr(y-5, x-45, "██╔████╔██║██║██╔██╗ ██║█████╗  ███████╗██║ █╗ ██║█████╗  █████╗  ██████╔╝█████╗  ██████╔╝");
		mvaddstr(y-4, x-45, "██║╚██╔╝██║██║██║╚██╗██║██╔══╝  ╚════██║██║███╗██║██╔══╝  ██╔══╝  ██╔═══╝ ██╔══╝  ██╔══██╗");
		mvaddstr(y-3, x-45, "██║ ╚═╝ ██║██║██║ ╚████║███████╗███████║╚███╔███╔╝███████╗███████╗██║     ███████╗██║  ██║");
		mvaddstr(y-2, x-45, "╚═╝     ╚═╝╚═╝╚═╝  ╚═══╝╚══════╝╚══════╝ ╚══╝╚══╝ ╚══════╝╚══════╝╚═╝     ╚══════╝╚═╝  ╚═╝");
	} else {
		mvaddstr(y-4, x-5, "MINESWEEPER");
	}
}

void help(int xcenter, int ycenter){
	struct button back = createButton(xcenter-2, ycenter+4, "BACK");

	int quit = 0,
		c = -1,
		selected = 0;

	clear();
	while (!quit) {
		if (c==410) {
			resize(1, 1, &xcenter, &ycenter, 1);
			back = createButton(xcenter-2, ycenter+4, "BACK");
		}
		back.hovered = 0;
		if (c==27)
			quit=1;
		if (c==259) // UP
			if (selected > 0)
				selected--;
		if (c==258) // 
			if (selected < 3)
				selected++;
		if (c == KEY_MOUSE) {
			if (getmouse(&event) == OK){
				if (event.x >= back.x && event.x < back.x + back.w && event.y >= back.y && event.y < back.y + back.h) {
					selected = 0;
					if (event.bstate == 2)
						quit = 1;
				}
			}
		}
		if (selected == 0) {
			back.hovered = 1;
			if (c==10)
				quit = 1;
		}
		if (!quit) {
			mvaddstr(ycenter+1, xcenter-6, "Use the mouse");
			mvaddstr(ycenter+2, xcenter-7, "or arrow keys to");
			mvaddstr(ycenter+3, xcenter-8, " select the option");
			addText(back);
			drawTitle(xcenter, ycenter);
			refresh();
			c = wgetch(stdscr);
		}
	}
	clear();
}

int chooseSize(int xcenter, int ycenter) {
	struct button easy = createButton(xcenter-2, ycenter+1, "EASY");
	struct button inter= createButton(xcenter-6, ycenter+2, "INTERMEDIATE");
	struct button hard = createButton(xcenter-2, ycenter+3, "HARD");
	struct button back = createButton(xcenter-2, ycenter+4, "BACK");

	int quit = 0,
		c = -1,
		selected = 0;

	clear();
	while (!quit) {
		if (c==410) {
			resize(1, 1, &xcenter, &ycenter, 1);
			easy = createButton(xcenter-2, ycenter+1, "EASY");
			inter= createButton(xcenter-6, ycenter+2, "INTERMEDIATE");
			hard = createButton(xcenter-2, ycenter+3, "HARD");
			back = createButton(xcenter-2, ycenter+4, "BACK");
		}
		easy.hovered = 0;
		inter.hovered = 0;
		hard.hovered = 0;
		back.hovered = 0;
		if (c == KEY_MOUSE) {
			if (getmouse(&event) == OK){
				if (event.x >= easy.x && event.x < easy.x + easy.w && event.y >= easy.y && event.y < easy.y + easy.h) {
					selected = 0;
					if (event.bstate == 2)
						quit = 2;
				} else if (event.x >= inter.x && event.x < inter.x + inter.w && event.y >= inter.y && event.y < inter.y + inter.h) {
					selected = 1;
					if (event.bstate == 2)
						quit = 3;
				} else if (event.x >= hard.x && event.x < hard.x + hard.w && event.y >= hard.y && event.y < hard.y + hard.h) {
					selected = 2;
					if (event.bstate == 2)
						quit = 4;
				} else if (event.x >= back.x && event.x < back.x + back.w && event.y >= back.y && event.y < back.y + back.h) {
					selected = 3;
					if (event.bstate == 2)
						quit = 1;
				}
			}
		}
		if (c==27)
			quit=1;
		if (c==259) // UP
			if (selected > 0)
				selected--;
		if (c==258) // 
			if (selected < 3)
				selected++;
		if (selected == 0){
			easy.hovered = 1;
			if (c==10)
				quit = 2;
		}else if (selected == 1) {
			inter.hovered = 1;
			if (c==10)
				quit = 3;
		}else if (selected == 2) {
			hard.hovered = 1;
			if (c==10)
				quit = 4;
		}else if (selected == 3) {
			back.hovered = 1;
			if (c==10)
				quit = 1;
		}
		if (!quit) {
			addText(easy);
			addText(inter);
			addText(hard);
			addText(back);
			drawTitle(xcenter, ycenter);
			refresh();
			c = wgetch(stdscr);
		}
	}
	clear();
	return quit;
}

int playGame(int n, int m, int n_mines, int xoffset, int yoffset) {
	struct button back = createButton(xoffset + m * 2 - 5, yoffset + n + 1, "BACK");

	int * mines = createArray(n*m);
	int * neighbors = createArray(n*m);
	int * board = createArray(n*m);
	fillMines(mines,n*m, n_mines);
	fillNeighbors(neighbors, mines, n, m);

	int quit = 0,
		row = -1,
		col = -1,
		c = -1,
		flags = 0,
		flag = 0;
	int X, Y;

	clear();
	while (!quit) {
		back.hovered = 0;
		if (c==410) {
			resize(n, m, &xoffset, &yoffset, 0);
			back = createButton(xoffset + m * 2 - 5, yoffset + n + 1, "BACK");
		}
		if (c=='a'){
			ai(board, n, m, &X, &Y, &flag);
			quit = (!show(mines, neighbors, board, n, m, X, Y, flag))?2:0;
			flags += flag;
		}
		if (c == KEY_MOUSE) {
			MEVENT event;
			if (getmouse(&event) == OK){
				row = event.y - yoffset;
				col = (event.x - xoffset) / 2;
				if (event.bstate == 2 && row >= 0 && row < n && col >= 0 && col < m)
					if (!show(mines, neighbors, board, n, m, row, col,0))
						quit = 2;
				if (event.bstate == 2048 && row >= 0 && row < n && col >= 0 && col < m)
					flags += show(mines, neighbors, board, n, m, row, col, 1);
				if (event.x >= back.x && event.x < back.x + back.w && event.y >= back.y && event.y < back.y + back.h) {
					back.hovered = 1;
					if (event.bstate == 2)
						quit = 1;
				}
			}
		}
		if (COLS < m*2 || ROWS < n+3) {
			mvaddstr(0, 0, "Terminal is too small");
		} else {
			drawBoard(board, n, m, xoffset, yoffset, row, col);
			addText(back);
			mvprintw(yoffset+n+1, xoffset, "⚑ %d/%d💣", flags, n_mines);

		}
		refresh();
		if (c==27)
			quit=1;
		if (countSpaces(board, n*m) == n_mines)
			quit=3;
		move(0,0);
		c = wgetch(stdscr);
	}
	if (quit == 2 || quit == 3) {
		end(board, n, m, quit, xoffset, yoffset);	
	}
	clear();
	free(mines);
	free(board);
	free(neighbors);
	return 0;
}

int menu(int xcenter, int ycenter) {
	struct button play_button = createButton(xcenter-2, ycenter+1, "PLAY");
	struct button help_button = createButton(xcenter-2, ycenter+2, "HELP");
	struct button quit_button = createButton(xcenter-2, ycenter+3, "QUIT");

	int quit = 0,
		c = -1,
		selected = 0;

	clear();
	while (!quit) {
		if (c==410) {
			resize(1, 1, &xcenter, &ycenter, 1);
			play_button = createButton(xcenter-2, ycenter+1, "PLAY");
			help_button = createButton(xcenter-2, ycenter+2, "HELP");
			quit_button = createButton(xcenter-2, ycenter+3, "QUIT");
		}
		play_button.hovered = 0;
		help_button.hovered = 0;
		quit_button.hovered = 0;
		if (c == KEY_MOUSE) {
			if (getmouse(&event) == OK) {
				if (event.x >= play_button.x && event.x < play_button.x + play_button.w && event.y >= play_button.y && event.y < play_button.y + play_button.h) {
					selected = 0;
					if (event.bstate == 2)
						quit = chooseSize(xcenter, ycenter)-1;
				} else if (event.x >= help_button.x && event.x < help_button.x + help_button.w && event.y >= help_button.y && event.y < help_button.y + help_button.h) {
					selected = 1;
					if (event.bstate == 2)
						help(xcenter, ycenter);
				} else if (event.x >= quit_button.x && event.x < quit_button.x + quit_button.w && event.y >= quit_button.y && event.y < quit_button.y + quit_button.h) {
					selected = 2;
					if (event.bstate == 2)
						quit = 4;
				}
			}
		}
		if (c==27)
			quit=4;
		if (c==259) // UP
			if (selected > 0)
				selected--;
		if (c==258) // 
			if (selected < 2)
				selected++;
		if (selected == 0){
			play_button.hovered = 1;
			if (c==10)
				quit = chooseSize(xcenter, ycenter)-1;
		}else if (selected == 1) {
			help_button.hovered = 1;
			if (c==10)
				help(xcenter, ycenter);
		}else if (selected == 2) {
			quit_button.hovered = 1;
			if (c==10)
				quit = 4;
		}
		if (!quit) {
			addText(play_button);
			addText(help_button);
			addText(quit_button);
			drawTitle(xcenter, ycenter);
			refresh();
			c = wgetch(stdscr);
		}
	}
	clear();
	return quit;
}

int main(int argc, char ** argv) {
    if (argv){
        printf("%s\n", argc[argv-1]);
        // stop warnings on Linux
    }
	srand(time(0));
	int quit = 0;
	initNcurse(&ROWS, &COLS);
	printf("\033[?1003h\n"); // Makes the terminal report mouse movement events

	while (!quit) {
		switch (menu(COLS / 2, ROWS / 2)) {
			case 1:
				//easy 10
				playGame(8, 8, 10, (COLS - 8*2) / 2, (ROWS - 8) / 2);
				break;
			case 2:
				//intermediate 40
				playGame(16, 16, 40, (COLS - 16*2) / 2, (ROWS - 16) / 2);
				break;
			case 3:
				//hard 99
				//playGame(80, 150, 2500, (COLS - 150*2) / 2, (ROWS - 80) / 2);
				playGame(16, 30, 99, (COLS - 30*2) / 2, (ROWS - 16) / 2);
				break;
			default:
				quit = 1;
				break;
		}
	}

	printf("\033[?1003l\n"); // Disable mouse movement events, as l = low

	endwin();

	system("clear");
	
	return 0;
}
