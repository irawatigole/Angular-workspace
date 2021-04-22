export function getErrorMessage(errors: any): string {
    let errorMessage = '';
    if (errors.status !== 500) {
      // const errorResponse = JSON.parse(errors._body);
      errorMessage = errors.error.error || errors.error.message;
      if (errors.status === 401 && errorMessage === 'Token is invalid or expired') {
        localStorage.removeItem('iup');
        localStorage.removeItem('iupp');
        const dateObj = new Date();
        dateObj.setDate(dateObj.getDate() - 1);
        document.cookie = 't=; expires=' + dateObj + ';';
        window.location.reload();
      }
    } else {
      console.log(errors);
      return 'Whoops something went wrong! Try again.';
    }

    return errorMessage;
  }