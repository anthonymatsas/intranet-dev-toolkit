const shell = window.require('electron').shell;

export const openLink = (link) => {
	if (! link) {
		return;
	}

	shell.openExternal(link);
}
