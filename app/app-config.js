/**
 * App config
 * @param  {Object} $compileProvider 
 * @param  {Object} $provide  
 */
export default function config($compileProvider, $provide) {
  $compileProvider.debugInfoEnabled(false);

  // Rethrow all uncaught errors from Angular expressions e.g. inside $apply
  // Let the top-level window.onerror listener handle these
  $provide.decorator('$exceptionHandler', () => {
    return (exception, cause) => {
      throw new Error(exception);
    };
  });
};

config.$inject  = ['$compileProvider', '$provide'];