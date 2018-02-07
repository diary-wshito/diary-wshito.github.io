(defparameter *list* '(a b c d e))

;; 書き換えられる
(let ((tmp *list*))
  (setf (nth 2 tmp) 0))
*list*

;; 書き換えられない
(let ((tmp (nth 2 *list*)))
  (setf tmp 9))
*list*


(defparameter *plist* '(:first a :second b :third c :fourth d))

;; 書き換えられる
(let ((tmp *plist*))
  (setf (getf tmp :third) 0))
*plist*


;; 書き換えられない
(let ((tmp (getf *plist* :third)))
  (setf tmp 9))
*plist*

(defparameter *alist* '((first a) (second b) (third c) (fourth d)))

;; setfのplace指定にassocは使えない！通常のリストとして操作する
; (let ((tmp *alist*))
;   (setf (assoc 'third tmp) '(third 0)))
; *plist*

(defparameter *array* #1a(a b c d))

(defparameter *list-array* `(a b ,*array* d e))

;; 書き換えられる
(let ((tmp *list-array*))
  (setf (aref (nth 2 tmp) 2) 0))
*list-array*

;; 書き換えられる！
(let ((tmp (nth 2 *list-array*)))
  (setf (aref tmp 2) 9))
*list-array*

(defparameter *plist* '(:first a :second b :third c :fourth d))
(defparameter *list-plist* `(a b ,*plist* d e))

;; 書き換えられる
(let ((tmp *list-plist*))
  (setf (getf (nth 2 tmp) :third) 0))
*list-plist*

;; 書き換えられる！
(let ((tmp (nth 2 *list-plist*)))
  (setf (getf tmp :third) 9))
*list-plist*


(defparameter *plist-plist* '(:first a :second b
			      :third (:one 1 :two 2 :three 3 :four 4)
			      :fourth d))

(let ((tmp (getf *plist-plist* :third)))
  (setf (getf tmp :three) 999))

*plist-plist*


;;;;;;;;;;;;;;;;;;;;;;;;;;

(defun main ()
  (let ((env (list :first 'a :second 'b
		   :third (list :one 1 :two 2 :three 3 :four 4)
		   :fourth 'd)))
    (format t "Before modify: ~a~%" env)
    (modify env)
    (format t " After modify: ~a~%" env)))
	
(defun modify (env)
  (let* ((sec (getf env :second))
	 (opt (getf env :third)))
    (setf (getf opt :three) 77)
    (setf (getf opt :four) 88)
    (setf (getf opt :five) 99)  ;; This does not get recorded!
    (format t "    In modify: :second =  ~a~%" sec))
  (format t "    In modify: ~a~%" env))


(main)
;;;;;;;;;;;;;;;;;;;;;;;;;;;

(modify *plist-plist*)

*plist-plist*
