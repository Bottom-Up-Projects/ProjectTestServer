#ifndef __QUEUE_H__
#define __QUEUE_H__

typedef unsigned long size_t;

template <typename T>
class queue {
    private:
    T* values;
    size_t _size;

    public:
    queue();
    queue(const queue<T>& other);
    ~queue();

    void push(T value);
    void pop();
    
    T front();
    T back();
    
    bool empty();
    size_t size();

    queue<T>& operator=(const queue<T>& other);
    bool operator==(const queue<T>& other);
    bool operator!=(const queue<T>& other);
    bool operator<(const queue<T>& other);
    bool operator>(const queue<T>& other);
    bool operator<=(const queue<T>& other);
    bool operator>=(const queue<T>& other);
};

template <typename T>
queue<T>::queue(){

}

template <typename T>
queue<T>::~queue(){

}

template <typename T>
void queue<T>::push(T value){

}

template <typename T>
void queue<T>::pop(){

}

template <typename T>
T queue<T>::front(){
    return T();
}

template <typename T>
T queue<T>::back(){
    return T();
}

template <typename T>
bool queue<T>::empty(){
    return true;
}

template <typename T>
size_t queue<T>::size(){
    return 0;
}

template <typename T>
queue<T>& queue<T>::operator=(const queue<T>& other){
    return queue<T>();
}

template <typename T>
bool queue<T>::operator==(const queue<T>& other){
    return true;
}

template <typename T>
bool queue<T>::operator!=(const queue<T>& other){
    return true;
}

template <typename T>
bool queue<T>::operator<(const queue<T>& other){
    return true;
}

template <typename T>
bool queue<T>::operator>(const queue<T>& other){
    return true;
}

template <typename T>
bool queue<T>::operator<=(const queue<T>& other){
    return true;
}

template <typename T>
bool queue<T>::operator>=(const queue<T>& other){
    return true;
}


#endif // __QUEUE_H__
