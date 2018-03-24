(defun setup ()
  (defparameter *dom*
    (lquery:parse-html "<html>
                          <div id=''content'>
                            <a href='1st.html' id='1'>1st link</a>
                            <a href='2nd.html' id='2'>2nd link</a>
                            <a href='3rd.html' id='3'>3rd link</a>
                            <a href='4th.html' id='4'>4th link</a>
                        </div>
                      </html>")))
(setup)
(let ((keep (lquery:$ *dom* "div" (children) (slice 1 2))))
  (lquery-funcs:replace-all (lquery:$ *dom* "div" (children)) keep)
  (lquery:$ *dom* (serialize)))
